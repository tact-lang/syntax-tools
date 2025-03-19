import {Cst, CstNode} from "../result";
import {childByField, childByType, childrenByType, idText, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList} from "./format-helpers";
import {formatType} from "./format-types";

export const formatExpression = (code: CodeBuilder, node: Cst): void => {
    if (node.$ === "node") {
        switch (node.type) {
            case "StringLiteral":
                code.add(visit(node).trim());
                return
            case "IntegerLiteral":
                code.add(visit(node).trim());
                return
            case "StructInstance":
                formatStructInstance(code, node);
                return
            case "SuffixCall":
                formatSuffixCall(code, node);
                return
            case "Parens":
                const expr = node.children[1]
                code.add("(").add(visit(expr)).add(")")
                return
            case "Binary": {
                const elements = node.children.filter(it => it.$ === "node")
                if (elements.length === 1) {
                    formatExpression(code, elements[0]);
                    return
                }
                code.add(visit(node));
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

const formatSuffixCall = (code: CodeBuilder, node: CstNode): void => {
    const args = childByField(node, "arguments");
    if (!args) {
        throw new Error("Invalid call expression");
    }

    formatCommaSeparatedList(code, args, (code, arg) => {
        formatExpression(code, arg);
    });
}; 
