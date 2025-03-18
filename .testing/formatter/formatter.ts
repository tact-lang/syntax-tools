import {Cst} from "../result";
import {CodeBuilder} from "../code-builder";
import {formatFunction} from "./format-declarations";
import {formatStatement} from "./format-statements";
import {formatExpression} from "./format-expressions";
import {visit} from "../cst-helpers";

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
        case "$Function":
            formatFunction(code, node);
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
