import {Cst, CstNode} from "../result";
import {childByField, childByType, nonLeafChild, textOfId, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatId, formatSeparatedList, idText} from "./format-helpers";
import {formatType} from "./format-types";

interface ChainCall {
    nodes: CstNode[]
    leadingComments: CstNode[]
    trailingComments: CstNode[]
    hasLeadingNewline: boolean
}

export const formatExpression = (code: CodeBuilder, node: Cst): void => {
    if (node.$ !== "node") {
        code.add(visit(node));
        return
    }

    switch (node.type) {
        case "expression": {
            const child = nonLeafChild(node);
            formatExpression(code, child);
            return
        }
        case "Operator": {
            const name = node.children[0];
            if (!name || name.$ !== "node") {
                code.add(visit(name).trim())
                return
            }
            code.add(visit(name.children[0]).trim())
            return
        }
        case "StringLiteral":
            code.add(visit(node).trim());
            return
        case "IntegerLiteral":
            code.add(visit(node).trim());
            return
        case "IntegerLiteralDec":
            code.add(visit(node).trim());
            return
        case "BoolLiteral":
            code.add(visit(node).trim());
            return
        case "Null":
            code.add("null");
            return
        case "StructInstance":
            formatStructInstance(code, node);
            return
        case "SuffixFieldAccess":
            formatSuffixFieldAccess(code, node);
            return
        case "SuffixUnboxNotNull":
            formatSuffixUnboxNotNull(code, node);
            return
        case "SuffixCall":
            formatSuffixCall(code, node);
            return
        case "Parens": {
            const child = childByField(node, "child")
            const expression = nonLeafChild(child);
            code.add("(").apply(formatExpression, expression).add(")")
            return
        }
        case "condition": {
            const expression = nonLeafChild(node)
            code.add("(").apply(formatExpression, expression).add(")")
            return
        }
        case "Conditional": {
            formatConditional(node, code);
            return;
        }
        case "Binary": {
            let lineLengthBeforeLeft = code.lineLength()
            let indented = false

            const processBinaryTail = (code: CodeBuilder, node: CstNode): void => {
                let needWrap = false

                for (const child of node.children) {
                    if (child.$ === "leaf") continue;
                    if (child.type === "Operator") {
                        code.space()
                    }
                    code.apply(formatExpression, child)
                    if (child.type === "Operator") {
                        needWrap = child.children.some(it => it.$ === "leaf" && it.text.includes("\n"))

                        const trailingComments = child.children.filter(it => it.$ === "node" && it.type === "Comment")

                        let seenComment = false
                        const needNewlineBeforeComments = child.children.some(it => {
                            if (it.$ === "leaf" && it.text.includes("\n") && !seenComment) {
                                return true
                            }
                            if (it.$ === "node" && it.type === "Comment") {
                                seenComment = true
                            }
                            return false
                        })

                        if (trailingComments.length > 0) {
                            code.space()
                            trailingComments.forEach((comment, index) => {
                                code.add(visit(comment))
                                if (index !== trailingComments.length - 1) {
                                    code.newLine()
                                }
                            })
                            needWrap = true
                        } else if (trailingComments.length > 0 && needNewlineBeforeComments) {
                            code.newLine()
                        } else if (!needWrap) {
                            code.space()
                        }
                    }

                    if (needWrap) {
                        if (!indented && lineLengthBeforeLeft > 0) {
                            code.indentCustom(lineLengthBeforeLeft)
                            indented = true
                        }
                        code.newLine()
                        needWrap = false
                    }
                }
            }

            const head = childByField(node, "head")
            const tail = childByField(node, "tail")

            if (head && tail) {
                code.apply(formatExpression, head)
                code.apply(processBinaryTail, tail)
                if (indented) {
                    code.dedent()
                }
            }

            return;
        }
        case "Unary": {
            const prefixes = childByField(node, "prefixes");
            const expression = childByField(node, "expression");

            if (!expression) {
                throw new Error("Invalid unary expression");
            }

            prefixes.children.forEach(prefix => {
                formatExpression(code, prefix);
            });
            formatExpression(code, expression);
            return;
        }
        case "ParameterList": {
            formatSeparatedList(code, node, (code, arg) => {
                formatExpression(code, arg);
            });
            return
        }
        case "Suffix": {
            formatSuffix(node, code);
            return
        }
        case "InitOf": {
            formatInitOf(code, node);
            return;
        }
        case "CodeOf": {
            formatCodeOf(code, node);
            return;
        }
        case "Id":
            code.apply(formatId, node);
            return;
    }

    code.add(visit(node).trim());
};

function formatConditional(node: CstNode, code: CodeBuilder) {
    // foo ? bar : baz
    // ^^^ ^^^^^^^^^^^
    // |   |
    // |   tailOpt
    // head
    const head = node.children[0];
    const tailOpt = childByField(node, "tail");
    if (!head) {
        throw new Error("Invalid conditional expression");
    }
    formatExpression(code, head);

    if (!tailOpt) return; // Incomplete ternary

    const thenBranch = tailOpt.children.find(it => it.$ === "node");
    const elseBranch = childByField(tailOpt, "elseBranch");
    if (!thenBranch || !elseBranch) {
        throw new Error("Invalid conditional branches");
    }

    const trueBranchCode = new CodeBuilder().apply(formatExpression, thenBranch).toString()
    const falseBranchCode = new CodeBuilder().apply(formatExpression, elseBranch).toString()

    const branchesWidth = trueBranchCode.length + falseBranchCode.length;

    const nestedConditional = thenBranch.type === "Conditional" || elseBranch.type === "Conditional";
    const multiline = branchesWidth > 70 || nestedConditional
    if (multiline) {
        // format as:
        // bar
        //     ? trueBranch
        //     : falseBranch
        code.newLine().indent()
            .add("?").space().apply(formatExpression, thenBranch)
            .newLine()
            .add(":").space().apply(formatExpression, elseBranch)
            .dedent()
    } else {
        // format as:
        // bar ? trueBranch : falseBranch
        code.space().add("?").space()
            .apply(formatExpression, thenBranch)
            .space().add(":").space()
            .apply(formatExpression, elseBranch)
    }
}

function formatInitOf(code: CodeBuilder, node: CstNode) {
    code.add("initOf");
    // initOf JettonWallet(0, sender)
    //        ^^^^^^^^^^^^ ^^^^^^^^^
    //        |            |
    //        |            params
    //        name
    const name = childByField(node, "name");
    const params = childByField(node, "params");
    if (!name) {
        throw new Error("Invalid initOf expression");
    }

    code.space().apply(formatId, name);
    formatSeparatedList(code, params, formatExpression);
}

function formatCodeOf(code: CodeBuilder, node: CstNode) {
    code.add("codeOf");
    // codeOf JettonWallet
    //        ^^^^^^^^^^^^ this
    const name = childByField(node, "name");
    if (!name) {
        throw new Error("Invalid codeOf expression");
    }

    code.space().apply(formatId, name);
}

const formatStructInstance = (code: CodeBuilder, node: CstNode): void => {
    // Foo { value: 100 }
    // ^^^ ^^^^^^^^^^^^^^
    // |   |
    // |   fields
    // type
    const type = childByField(node, "type");
    const fields = childByType(node, "StructInstanceFields");

    if (!type || !fields || fields.$ === "leaf") {
        throw new Error("Invalid struct instance");
    }

    code.apply(formatType, type).space()

    formatSeparatedList(code, fields, (code, field) => {
        if (field.$ !== "node") return

        // `value: 100` or just `value`
        const name = childByField(field, "name");
        if (!name) throw new Error("Invalid field initializer");

        code.add(textOfId(name));

        // value: 100
        //      ^^^^^ this
        const initOpt = childByField(field, "init");
        if (initOpt) {
            code.add(":").space();
            formatExpression(code, nonLeafChild(initOpt));
        }
    }, {
        startIndex: 1,
        endIndex: -1,
        wrapperLeft: "{",
        wrapperRight: "}",
        extraWrapperSpace: " ",
        provideTrailingComments: field => {
            if (field.$ !== "node") return []

            // value: 100
            //      ^^^^^ this
            const initOpt = childByField(field, "init");

            const searchField = initOpt ? "init" : "name"
            const endIndex = field.children.findIndex(it => it.$ === "node" && it.field === searchField)
            const comments = field.children.slice(endIndex).filter(child => child.$ === "node" && child.type === "Comment");
            if (comments.length > 0) {
                return comments
            }
            return []
        }
    });
};

function formatSuffix(node: CstNode, code: CodeBuilder) {
    const suffixes = childByField(node, "suffixes");
    if (!suffixes) {
        return;
    }

    const infos: ChainCall[] = []
    let suffixesList = suffixes.type === "SuffixFieldAccess" || suffixes.type === "SuffixCall" || suffixes.type === "SuffixUnboxNotNull"
        ? [suffixes]
        : suffixes.children

    // foo.bar()
    // ^^^
    const firstExpression = node.children[0];
    // foo.bar()
    //        ^^
    const firstSuffix = suffixesList[0];

    // first call suffix attached to first expression
    const firstSuffixIsCallOrNotNull = firstSuffix && firstSuffix.$ === "node" && (firstSuffix.type === "SuffixCall" || firstSuffix.type === "SuffixUnboxNotNull");
    if (firstSuffixIsCallOrNotNull) {
        suffixesList = suffixesList.slice(1)
    }

    suffixesList.forEach((suffix) => {
        if (suffix.$ !== "node") return;

        if (suffix.type === "SuffixFieldAccess") {
            const name = childByField(suffix, "name")
            infos.push({
                nodes: [suffix],
                hasLeadingNewline: name.children.some(it => it.$ === "leaf" && it.text.includes("\n")),
                leadingComments: [],
                trailingComments: [],
            })
        }

        if (suffix.type === "SuffixCall" && infos.length > 0) {
            const lastInfo = infos.at(-1);
            lastInfo.nodes.push(suffix)

            const params = childByField(suffix, "params")
            lastInfo.hasLeadingNewline = params.children.some(it => it.$ === "leaf" && it.text.includes("\n"))
        }

        if (suffix.type === "SuffixUnboxNotNull" && infos.length > 0) {
            const lastInfo = infos.at(-1);
            lastInfo.nodes.push(suffix)
        }
    })

    const indent = infos.slice(0, -1).some(call => call.hasLeadingNewline) ? 4 : 0;

    formatExpression(code, firstExpression)

    if (firstSuffixIsCallOrNotNull) {
        formatExpression(code, firstSuffix)
    }

    const shouldBeMultiline = indent > 0 ||
        infos.slice(0, -1).some(call =>
            call.leadingComments.length > 0 ||
            call.trailingComments.length > 0
        );

    if (shouldBeMultiline) {
        code.indent()
        code.newLine()

        infos.forEach((info, index) => {
            info.nodes.forEach(child => {
                code.apply(formatExpression, child)
            })

            if (index !== infos.length - 1) {
                code.newLine()
            }
        })

        code.dedent()
    } else {
        infos.forEach(info => {
            info.nodes.forEach(child => {
                code.apply(formatExpression, child)
            })
        })
    }

    return;
}

const formatSuffixFieldAccess = (code: CodeBuilder, node: CstNode): void => {
    const name = childByField(node, "name");
    if (!name) {
        throw new Error("Invalid field access expression");
    }

    code.add(".")
    code.apply(formatId, name)
};

const formatSuffixUnboxNotNull = (code: CodeBuilder, _node: CstNode): void => {
    code.add("!!")
};

const formatSuffixCall = (code: CodeBuilder, node: CstNode): void => {
    const args = childByField(node, "params");
    if (!args) {
        throw new Error("Invalid call expression");
    }

    const endIndex = args.children.findIndex(it => it.$ === "leaf" && it.text === ")")

    formatSeparatedList(code, args, (code, arg) => {
        formatExpression(code, arg);
    }, {
        endIndex,
    });

    const comments = args.children.slice(endIndex).filter(child => child.$ === "node" && child.type === "Comment");
    if (comments.length > 0) {
        code.space()
        comments.forEach(comment => {
            code.add(visit(comment))
        })
    }
};
