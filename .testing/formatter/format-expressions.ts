import {Cst, CstNode} from "../result";
import {childByField, childByType, nonLeafChild, textOfId, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatSeparatedList, idText} from "./format-helpers";
import {formatType} from "./format-types";

interface ChainedCall {
    type: "call" | "field";
    name: string;
    parameters?: CstNode;
    leadingComments: CstNode[];
    trailingComments: CstNode[];
    hasLeadingNewline: boolean;
    hasTrailingNewline: boolean;
}

interface ChainInfo {
    calls: ChainedCall[];
    indent: number;
}

function collectChainInfo(node: CstNode): ChainInfo {
    const result: ChainInfo = {
        calls: [],
        indent: 0
    };

    const initialExpr = node.children[0];
    if (!initialExpr) {
        throw new Error("Invalid initial expression");
    }

    const suffixes = childByField(node, "suffixes");
    if (!suffixes) {
        return result;
    }

    let lastFieldName: undefined | string = undefined;
    if (initialExpr.$ === "node" && initialExpr.type === "Id") {
        lastFieldName = visit(initialExpr);
    }

    const suffixesList = suffixes.children
    let currentCall: undefined | ChainedCall = undefined;
    let currentAccess: undefined | string = undefined;
    let leadingComments: CstNode[] = [];

    for (const child of suffixesList) {
        if (child.$ === "leaf") {

        } else if (child.type === "Comment") {
            if (currentCall) {
                currentCall.trailingComments.push(child);
            } else {
                leadingComments.push(child);
            }
        } else if (child.type === "SuffixCall") {
            if (!lastFieldName) {
                throw new Error("Invalid call expression: no field name before call");
            }

            const parameters = childByField(child, "params");

            currentCall = {
                type: "call",
                name: lastFieldName,
                leadingComments,
                trailingComments: [],
                hasLeadingNewline: parameters.children.some(it => it.$ === "leaf" && it.text.includes("\n")),
                hasTrailingNewline: false,
                parameters,
            };

            lastFieldName = null;
            leadingComments = [];
            currentAccess = undefined;
        } else if (child.type === "SuffixFieldAccess") {
            const name = childByField(child, "name");
            if (!name || name.$ !== "node" || name.type !== "Id") {
                throw new Error("Invalid field access name");
            }

            lastFieldName = visit(name);

            if (currentAccess) {
                result.calls.push({
                    type: "field",
                    name: currentAccess,
                    hasLeadingNewline: false,
                    hasTrailingNewline: false,
                    leadingComments: [],
                    trailingComments: [],
                });
                currentAccess = undefined
                continue
            }

            if (currentCall) {
                result.calls.push(currentCall);
                currentCall = null;
            }
            currentAccess = lastFieldName
        }
    }

    if (currentCall) {
        result.calls.push(currentCall);
    }

    if (currentAccess) {
        result.calls.push({
            type: "field",
            name: currentAccess,
            hasLeadingNewline: false,
            hasTrailingNewline: false,
            leadingComments: [],
            trailingComments: [],
        });
    }

    result.indent = result.calls.some(call => call.hasLeadingNewline || call.hasTrailingNewline) ? 4 : 0;

    return result;
}

function formatChain(code: CodeBuilder, info: ChainInfo): void {
    const shouldBeMultiline = info.indent > 0 ||
        info.calls.some(call =>
            call.leadingComments.length > 0 ||
            call.trailingComments.length > 0
        );

    if (shouldBeMultiline) {
        const firstCall = info.calls[0]
        code.add(firstCall.name);

        if (firstCall.type === "call" && firstCall.parameters) {
            formatSeparatedList(code, firstCall.parameters, (code, arg) => {
                formatExpression(code, arg);
            });
        }

        code.newLine().indent()

        const calls = info.calls.slice(1);
        calls.forEach((call, index) => {
            call.leadingComments.forEach(comment => {
                code.add(visit(comment));
                code.newLine();
            });

            code.add(".").add(call.name);

            if (call.type === "call" && call.parameters) {
                formatSeparatedList(code, call.parameters, (code, arg) => {
                    formatExpression(code, arg);
                });
            }

            call.trailingComments.forEach(comment => {
                code.space().add(visit(comment));
                code.newLine();
            });

            if (index !== calls.length - 1) {
                code.newLine();
            }
        });

        code.dedent();
    } else {
        const firstCall = info.calls[0]
        code.add(firstCall.name);
        if (firstCall.type === "call" && firstCall.parameters) {
            formatSeparatedList(code, firstCall.parameters, (code, arg) => {
                formatExpression(code, arg);
            });
        }

        const calls = info.calls.slice(1);
        calls.forEach(call => {
            code.add(".").add(call.name);
            if (call.type === "call" && call.parameters) {
                formatSeparatedList(code, call.parameters, (code, arg) => {
                    formatExpression(code, arg);
                });
            }
        });
    }
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
                code.add(visit(node).trim())
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
        case "SuffixCall":
            formatSuffixCall(code, node);
            return
        case "Parens": {
            const child = childByField(node, "child")
            code.add("(")
            formatExpression(code, nonLeafChild(child))
            code.add(")")
            return
        }
        case "Conditional": {
            formatConditional(node, code);
            return;
        }
        case "Binary": {
            const left = childByField(node, "left");
            const op = childByType(node, "Operator");
            const right = childByField(node, "right");

            if (!left || !op || !right) {
                throw new Error("Invalid binary expression");
            }

            formatExpression(code, left);
            code.space();
            formatExpression(code, op);
            code.space();
            formatExpression(code, right);
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
        case "Suffix": {
            const suffixes = childByField(node, "suffixes");
            if (!suffixes) {
                return;
            }

            const suffixesList = suffixes.children
            if (suffixesList.length === 1) {
                const suffix = suffixesList[0]
                formatExpression(code, node.children[0])
                formatExpression(code, suffix)
                return
            }

            if (suffixesList.length === 2) {
                formatExpression(code, node.children[0])
                formatExpression(code, suffixesList[0])
                formatExpression(code, suffixesList[1])
                return
            }
            if (suffixesList.length === 3) {
                formatExpression(code, node.children[0])
                formatExpression(code, suffixesList[0])
                formatExpression(code, suffixesList[1])
                formatExpression(code, suffixesList[2])
                return
            }
            if (suffixesList.length === 4) {
                formatExpression(code, node.children[0])
                formatExpression(code, suffixesList[0])
                formatExpression(code, suffixesList[1])
                formatExpression(code, suffixesList[2])
                formatExpression(code, suffixesList[3])
                return
            }

            const chainInfo = collectChainInfo(node);
            formatChain(code, chainInfo);
            return;
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
            code.add(idText(node));
            return;
    }

    code.add(visit(node));
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

    const trueBranchCode = new CodeBuilder()
    formatExpression(trueBranchCode, thenBranch);
    const falseBranchCode = new CodeBuilder()
    formatExpression(falseBranchCode, elseBranch);

    const branchesWidth = trueBranchCode.toString().length + falseBranchCode.toString().length;

    const multiline = branchesWidth > 70
    if (multiline) {
        // format as:
        // bar
        //     ? trueBranch
        //     : falseBranch
        code.newLine().indent().add("?").space();
        formatExpression(code, thenBranch);
        code.newLine().add(":").space();
        formatExpression(code, elseBranch);
        code.dedent()
    } else {
        // format as:
        // bar ? trueBranch : falseBranch
        code.space().add("?").space();
        formatExpression(code, thenBranch);
        code.space().add(":").space();
        formatExpression(code, elseBranch);
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

    code.space().add(idText(name));
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

    code.space().add(idText(name));
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

    formatType(code, type);
    code.space()

    formatSeparatedList(code, fields, (code, field) => {
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
    });
};

const formatSuffixFieldAccess = (code: CodeBuilder, node: CstNode): void => {
    const name = childByField(node, "name");
    if (!name) {
        throw new Error("Invalid field access expression");
    }

    code.add(".")
    const name1 = childByField(name, "name")
    if (name1.$ !== "node") {
        throw new Error("Invalid field access expression");
    }
    const textLeaf = name1.children[0]
    if (textLeaf.$ !== "leaf") {
        throw new Error("Invalid field access expression");
    }

    code.add(textLeaf.text)
};

const formatSuffixCall = (code: CodeBuilder, node: CstNode): void => {
    const args = childByField(node, "params");
    if (!args) {
        throw new Error("Invalid call expression");
    }

    formatSeparatedList(code, args, (code, arg) => {
        formatExpression(code, arg);
    });
};
