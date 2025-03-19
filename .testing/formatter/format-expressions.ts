import {Cst, CstLeaf, CstNode} from "../result";
import {childByField, childByType, childrenByType, idText, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList} from "./format-helpers";
import {formatType} from "./format-types";

export const formatExpression = (code: CodeBuilder, node: Cst): void => {
    if (node.$ === "node") {
        switch (node.type) {
            case "Operator":
                const name = node.children[0] as CstNode;
                code.add(visit(name.children[0]))
                return
            case "StringLiteral":
                code.add(visit(node).trim());
                return
            case "IntegerLiteral":
                code.add(visit(node).trim());
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
                const child = childByField(node, "child") as CstNode
                const expr = child.children[1]
                code.add("(")
                formatExpression(code, expr)
                code.add(")")
                return
            }
            case "condition": {
                const expr = node.children[1]
                code.add("(").add(visit(expr)).add(")")
                return
            }
            case "Binary": {
                const left = childByField(node, "left")
                const op = childByType(node, "Operator")
                const right = childByField(node, "right")

                formatExpression(code, left)
                code.space()
                formatExpression(code, op)
                code.space()
                formatExpression(code, right)
                return
            }
            case "Unary": {
                const elements = node.children.filter(it => it.$ === "node")
                if (elements.length === 1) {
                    formatExpression(code, elements[0]);
                    return
                }
                code.add(visit(node));
                return
            }
            case "Suffix": {
                const elements = node.children.filter(it => it.$ === "node")
                if (elements.length === 1) {
                    formatExpression(code, elements[0]);
                    return
                }
                if (elements.length === 2 && elements[1].type === "suffixes") {
                    const suffixes = elements[1].children
                    formatExpression(code, elements[0]);
                    suffixes.forEach((suffix) => {
                        formatExpression(code, suffix);
                    })
                    return
                }
                code.add(visit(node).trim());
                return
            }
            case "Conditional": {
                const elements = node.children.filter(it => it.$ === "node")
                if (elements.length === 1) {
                    formatExpression(code, elements[0]);
                    return
                }
                code.add(visit(node));
                return
            }
        }
    }

    code.add(visit(node));
};

const formatStructInstance = (code: CodeBuilder, node: CstNode): void => {
    const type = childByField(node, "type");
    const fields = childByType(node, "StructInstanceFields");

    if (!type || !fields || fields.$ === "leaf") {
        throw new Error("Invalid struct instance");
    }

    formatType(code, type);
    code.space()

    formatCommaSeparatedList(code, fields, (code, field) => {
        const name = childByField(field, "name");
        const init = childByType(field, "init");
        if (!name) throw new Error("Invalid field initializer");

        code.add(idText(name));
        if (init && init.$ === "node") {
            code.add(":").space();
            formatExpression(code, init.children.at(-1));
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

    formatCommaSeparatedList(code, args, (code, arg) => {
        formatExpression(code, arg);
    });
};
