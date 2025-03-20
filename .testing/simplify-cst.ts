import {Cst, CstNode} from "./result";

export const simplifyCst = (node: Cst): Cst => {
    if (node.$ === "leaf") {
        return node
    }

    if (node.type === "ParameterList") {
        return {
            ...node,
            children: node.children.flatMap(it => {
                if (it.$ === "node" && it.field === "tail") {
                    return it.children.flatMap(it => simplifyCst(it))
                }
                return simplifyCst(it)
            })
        }
    }

    if (node.type === "traits" || node.type === "fields" || node.type === "args") {
        return {
            ...node,
            children: node.children.flatMap(it => {
                if (it.$ === "node" && it.type === "tail") {
                    return it.children.flatMap(it => simplifyCst(it))
                }
                return simplifyCst(it)
            })
        }
    }

    if (node.type === "IntegerLiteral" && node.children.length === 1) {
        const child = simplifyCst(node.children[0])
        if (child.$ !== "node") return child
        const value = child.children[0];
        if (value.$ !== "node") return child
        return {
            ...node,
            children: [
                {
                    ...value,
                    field: "value"
                }
            ]
        }
    }

    if ((node.type === "Binary" || node.type === "Unary" || node.type === "Suffix" || node.type === "Conditional") && node.children.length === 1) {
        const firstChild = node.children[0]
        const result = simplifyCst(firstChild);
        if (result.$ === "leaf") return result
        return {
            ...result,
            group: node.group,
            field: node.field,
        }
    }

    if (node.type === "Binary" && node.children.length === 2) {
        const firstChild = simplifyCst(node.children[0])
        const lastChild = simplifyCst(node.children[1])
        if (firstChild.$ !== "node" || lastChild.$ !== "node") {
            return node
        }

        const [op, right, ...tail] = lastChild.children
        if (right.$ !== "node" || op.$ !== "node") {
            return node
        }

        return {
            ...node,
            children: [{
                ...firstChild,
                field: "left"
            }, {
                ...op,
                field: "op",
            }, {
                ...right,
                field: "right",
                children: [...right.children, ...tail]
            }],
        }
    }

    const processedChildren = node.children.flatMap(it => {
        if (it.$ !== "node") return it

        if (it.children.length === 1 && it.field === it.type) {
            const firstChild = it.children[0]
            if (!firstChild || firstChild.$ !== "node") return it
            return {
                ...firstChild,
                field: it.field,
            }
        }

        return it
    })

    return {
        ...node,
        children: processedChildren.flatMap(it => simplifyCst(it)),
    }
};

let pendingComments: Cst[] = []

function extractComments(commentPoint: CstNode) {
    let comments: Cst[] = []

    let endIndex = commentPoint.children.length - 1
    for (; endIndex >= 0; endIndex--) {
        const node = commentPoint.children[endIndex];
        if (node.$ === "leaf" && (node.text.includes("\n") || node.text.includes(" "))) {
            comments.push(node)
            continue
        }
        if (node.$ !== "node") continue;
        if (node.type !== "Comment") break
        comments.push(node)
    }

    if (comments.length === 0) return []

    let skip = 0

    comments = comments.reverse()

    for (; skip < comments.length; skip++) {
        const node = comments[skip]
        if (node.$ === "leaf" && !node.text.includes("\n")) {
            continue
        }
        break
    }

    comments = comments.slice(skip)

    skip = 0
    for (; skip < comments.length; skip++) {
        const node = comments[skip]
        if (node.$ === "node" && node.type === "Comment") {
            continue
        }
        break
    }

    comments = comments.slice(skip)

    skip = 0
    for (; skip < comments.length; skip++) {
        const node = comments[skip]
        if (node.$ === "leaf") {
            continue
        }
        break
    }

    comments = comments.slice(skip)

    for (let i = 0; i < comments.length; i++) {
        commentPoint.children.pop()
    }

    return comments
}

export const processDocComments = (node: Cst): Cst => {
    if (node.$ === "leaf") {
        return node
    }

    if (node.type === "Root") {
        let comments: Cst[] = []

        let startIndex = 0
        for (; startIndex <= node.children.length; startIndex++) {
            const element = node.children[startIndex];
            if (element.$ === "leaf" && (element.text.includes("\n") || element.text.includes(" "))) {
                comments.push(element)
                continue
            }
            if (element.$ !== "node") continue;
            if (element.type !== "Comment") break
            comments.push(element)
        }

        for (let i = 0; i < comments.length; i++) {
            node.children.shift()
        }

        pendingComments = comments
    }

    if (node.type === "Contract" || node.type === "Trait") {
        let comments: Cst[] = []

        const openBraceIndex = node.children.findIndex(it => it.$ === "leaf" && it.text === "{")

        const childrenToProcess = node.children.slice(openBraceIndex)
        const restChildren = node.children.slice(0, openBraceIndex)

        let startIndex = 0
        for (; startIndex <= childrenToProcess.length; startIndex++) {
            const element = childrenToProcess[startIndex];
            if (element.$ === "leaf" && (element.text.includes("\n") || element.text.includes(" "))) {
                comments.push(element)
                continue
            }
            if (element.$ !== "node") continue;
            if (element.type !== "Comment") break
            comments.push(element)
        }

        for (let i = 0; i < comments.length; i++) {
            childrenToProcess.shift()
        }

        node.children = [...restChildren, ...childrenToProcess]

        pendingComments = comments
    }

    if (node.type === "items" || node.type === "declarations") {
        const items = node.children;
        items.forEach((item) => {
            if (item.$ !== "node") return;

            if (pendingComments.length > 0) {
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

            if (item.type === "Contract") {
                const comments = extractComments(item);
                pendingComments.push(...comments)
                return
            }

            let commentPoint = item.children.at(-1)
            if (commentPoint && commentPoint.$ === "node") {
                if (commentPoint.type === "FunctionDefinition") {
                    commentPoint = commentPoint.children[0] as CstNode
                }
                const comments = extractComments(commentPoint);
                pendingComments.push(...comments)
            }
        })
    }

    return {
        ...node,
        children: node.children.flatMap(it => processDocComments(it)),
    }
}
