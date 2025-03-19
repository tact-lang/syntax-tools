import {Cst} from "../result";
import {CodeBuilder} from "../code-builder";
import {formatFunction} from "./format-declarations";
import {formatStatement} from "./format-statements";
import {formatExpression} from "./format-expressions";
import {visit, childByField} from "../cst-helpers";
import {formatContract} from "./format-contracts";

export const format = (node: Cst): string => {
    const code = new CodeBuilder();
    formatNode(code, node);
    return code.toString();
};

const formatNode = (code: CodeBuilder, node: Cst): void => {
    if (node.$ === "leaf") {
        code.add(node.text);
        return;
    }

    switch (node.type) {
        case "Root":
            node.children.forEach((child, index) => {
                formatNode(code, child);
                if (index < node.children.length - 2) {
                    code.newLine();
                }
            });
            break;

        case "Module":
            const items = childByField(node, "items");
            if (!items) {
                break
            }

            items.children.forEach((item, index) => {
                if (item.$ !== "node") return;

                formatNode(code, item);
                if (index < items.children.length - 1) {
                    code.newLine();
                    code.newLine();
                }
            });
            break;

        case "$Function":
            formatFunction(code, node);
            break;
        case "Contract":
            formatContract(code, node);
            break;
        case "Comment":
            code.add(visit(node));
            break;
        default:
            if (node.group === "statement") {
                formatStatement(code, node);
            } else if (node.group === "expression") {
                formatExpression(code, node);
            } else {
                code.add(visit(node));
            }
    }
};
