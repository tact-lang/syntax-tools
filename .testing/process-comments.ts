import {Cst, CstNode} from "./result";
import {childByField} from "./cst-helpers";

let pendingComments: Cst[] = []

interface CommentsExtraction {
    comments: Cst[]
    startIndex: number
}

// $Function
//   "fun"
//   " "
//   name: Id
//   parameters: ParameterList
//   body: FunctionDefinition
//
//     body: body
//       "{"
//       "}"
//       " "
//       Comment
//         "//"
//         " inline comment"
//       "\n\n"
//       Comment
//         "//"
//         " comment"
//       "\n"
//
//       ^^^^^^^^^^ this
//
// Comments here can be both inline (attached to node) and plain one (actually attached to the next declaration)
function extractComments([commentPoint, anchor]: [CstNode, string]): undefined | CommentsExtraction {
    const anchorIndex = commentPoint.children.findIndex(it => it.$ === "leaf" && it.text === anchor)
    if (anchorIndex === -1) {
        // No anchor, bug?
        return undefined
    }

    const actualAnchorIndex = anchorIndex + 1;
    const followingLeafs = commentPoint.children.slice(actualAnchorIndex)
    const hasComments = followingLeafs.some(it => it.$ === "node" && it.type === "Comment")
    if (!hasComments) {
        // no comments, no need to do anything
        return undefined
    }

    // find index where we break on the next line
    const inlineCommentsIndex = actualAnchorIndex + followingLeafs.findIndex(it => it.$ === "leaf" && it.text.includes("\n"))

    // all before, inline comments that we don't touch
    // const _inlineComments = commentPoint.children.slice(0, inlineCommentsIndex - 1)

    // all after newline (inclusive)
    const remainingLeafs = commentPoint.children.slice(inlineCommentsIndex)

    const lastLeaf = remainingLeafs.at(-1);
    // Comment is attached to declaration only when the last whitespace is not several line breaks
    const isAttachedTo = lastLeaf.$ === "leaf" && !containsSeveralNewlines(lastLeaf.text)
    if (!isAttachedTo) {
        // comments are not attached, need to add a separate statement? TODO
        return undefined
    }

    return {
        comments: remainingLeafs,
        startIndex: inlineCommentsIndex + 1
    }
}

function containsSeveralNewlines(text: string): boolean {
    const index = text.indexOf("\n")
    if (index === -1) {
        return false
    }
    return text.substring(index + 1).includes("\n")
}

export const processDocComments = (node: Cst): Cst => {
    if (node.$ === "leaf") {
        return node
    }

    // // comment
    // const FOO: Int = 100;
    //
    // CST looks like this:
    //
    // Root
    //   "\n"
    //   Comment
    //     "//"
    //     " comment here"
    //   "\n"
    //   Comment
    //     "//"
    //     " comment here"
    //   "\n"
    //   Module
    //     items: items
    //       Constant
    //
    // And we need to extract top-level comment and attach it to next declaration
    if (node.type === "Root") {
        // Step 1: collect all nodes to Module
        const moduleIndex = node.children.findIndex(it => it.$ === "node" && it.type === "Module")
        if (moduleIndex === -1) {
            // not Module?
            // no need to do anything
            return {
                ...node,
                children: node.children.map(it => processDocComments(it))
            }
        }

        if (moduleIndex === 0) {
            // no nodes before Module, skip
            return {
                ...node,
                children: node.children.map(it => processDocComments(it))
            }
        }

        const initialLeafs = node.children.slice(0, moduleIndex)
        const hasComments = initialLeafs.some(it => it.$ === "node" && it.type === "Comment")
        if (!hasComments) {
            // no comments, no need to do anything
            return {
                ...node,
                children: node.children.map(it => processDocComments(it))
            }
        }

        const lastLeaf = initialLeafs.at(-1);

        // Comment is attached to declaration only when the last whitespace is not several line breaks
        const isAttachedTo = lastLeaf.$ === "leaf" && !containsSeveralNewlines(lastLeaf.text)
        if (!isAttachedTo) {
            // if comments are not attached, then we don't need to do anything
            return {
                ...node,
                children: node.children.map(it => processDocComments(it))
            }
        }

        // skip top level whitespaces before comment
        const firstCommentIndex = initialLeafs.findIndex(it => it.$ === "node" && it.type === "Comment")

        // TODO: take only consecutive comments

        pendingComments = initialLeafs.slice(firstCommentIndex)

        // remove all extracted comments from Root
        const newChildren = [...node.children.slice(0, firstCommentIndex), ...node.children.slice(moduleIndex)];
        return {
            ...node,
            children: newChildren.map(it => processDocComments(it))
        }
    }

    // items: Contract
    //   "contract"
    //   " "
    //   name: Id
    //     name: name
    //       "Foo"
    //     " "
    //   "{"
    //   "\n    "
    //   Comment
    //     "//"
    //     " comment"
    //   "\n"
    //   "}"
    //   "\n\n"
    if (node.type === "Contract" || node.type === "Trait") {
        // starting point to find any first comments
        const openBraceIndex = node.children.findIndex(it => it.$ === "leaf" && it.text === "{")
        const closeBraceIndex = node.children.findIndex(it => it.$ === "leaf" && it.text === "}")

        const childrenToProcess = node.children.slice(openBraceIndex + 1, closeBraceIndex)

        // all children before open brace
        const childrenBefore = node.children.slice(0, openBraceIndex + 1)
        const childrenAfter = node.children.slice(closeBraceIndex)

        // collect all nodes until some declaration
        const comments: Cst[] = []
        for (let index = 0; index < childrenToProcess.length; index++) {
            const element = childrenToProcess[index];
            if (element.$ === "node" && element.type !== "Comment") {
                // found declaration
                break
            }
            comments.push(element)
        }

        const hasComments = comments.some(it => it.$ === "node" && it.type === "Comment")
        if (!hasComments) {
            // no comments, no need to do anything
            return {
                ...node,
                children: node.children.map(it => processDocComments(it))
            }
        }

        // remove all collected comments and whitespaces
        for (let i = 0; i < comments.length; i++) {
            childrenToProcess.shift()
        }

        pendingComments = comments

        if (childrenToProcess.length === 0) {
            // empty contract with just comment
            childrenToProcess.push(...comments)
            pendingComments = []
        }

        const newChildren = [...childrenBefore, ...childrenToProcess, ...childrenAfter]
        return {
            ...node,
            children: newChildren.flatMap(it => processDocComments(it)),
        }
    }

    // Root
    //   "\n"
    //   Module
    //     items: items
    //       Constant
    //         "const"
    //         " "
    //         name: Id
    //         type: type
    //         body: ConstantDefinition
    //           "="
    //           " "
    //           expression: IntegerLiteral
    //             value: IntegerLiteralDec
    //               digits: digits
    //                 "10"
    //           ";"
    //           " "
    //           Comment
    //             "//"
    //             " inline comment"
    //           "\n\n"
    //           Comment
    //             "//"
    //             " comment"
    //           "\n"
    //       $Function
    //         "fun"
    //         " "
    //         name: Id
    //         parameters: ParameterList
    //         body: FunctionDefinition
    //           body: body
    //             "{"
    //             "}"
    //             " "
    //             Comment
    //               "//"
    //               " inline comment"
    //             "\n\n"
    //             Comment
    //               "//"
    //               " comment"
    //             "\n"
    //       Contract
    //         "contract"
    //         " "
    //         name: Id
    //           name: name
    //             "Foo"
    //           " "
    //         "{"
    //         "}"
    //         "\n\n"
    //         Comment
    //           "//"
    //           " comment"
    //         "\n"
    //
    // Comments fore declaration are located inside previous declaration
    if (node.type === "items" || node.type === "declarations") {
        const items = node.children;

        const findNodeWithComments = (node: CstNode): undefined | [CstNode, string] => {
            if (node.type === "Contract") {
                return [node, "}"]
            }
            if (node.type === "PrimitiveTypeDecl") {
                return [node, ";"]
            }
            if (node.type === "NativeFunctionDecl") {
                return [node, ";"]
            }
            if (node.type === "AsmFunction") {
                return [node, "}"]
            }
            if (node.type === "Trait") {
                return [node, "}"]
            }
            if (node.type === "StructDecl" || node.type === "MessageDecl") {
                return [node, "}"]
            }
            if (node.type === "$Function") {
                const body = childByField(node, "body")
                return [childByField(body, "body"), "}"]
            }
            if (node.type === "Constant") {
                return [childByField(node, "body"), ";"]
            }

            const lastChildren = node.children.at(-1);
            if (lastChildren.$ !== "node") return undefined
            return [lastChildren, "}"]
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.$ !== "node") continue;

            // If there are some pending comments, we insert it as a new children
            if (pendingComments.length > 0 && item.type !== "Comment") {
                item.children.splice(0, 0, {
                    $: "node",
                    type: "DocComments",
                    children: pendingComments,
                    field: "doc",
                    group: "",
                    id: 0,
                })
                pendingComments = []
            }

            if (item.type === "Comment") {
                pendingComments.push(item)

                // remove comment and go back to not increment too much
                items.splice(i, 1)
                i--
                continue;
            }

            const found = findNodeWithComments(item);
            if (!found) {
                continue;
            }

            const commentOwner = found
            if (!commentOwner[0]) {
                continue;
            }

            const res = extractComments(commentOwner);
            if (!res) {
                continue;
            }

            const {comments, startIndex} = res;
            const owner = commentOwner[0]

            owner.children = owner.children.slice(0, startIndex)

            pendingComments.push(...comments)
        }

        // comments aren't attached to anything
        if (pendingComments.length > 0) {
            node.children.push(...pendingComments)
            pendingComments = []
        }
    }

    return {
        ...node,
        children: node.children.flatMap(it => processDocComments(it)),
    }
}
