import {childByField, childByType, visit} from "../cst-helpers";
import {CstNode} from "../result";
import {CodeBuilder} from "../code-builder";
import {formatExpression} from "./format-expressions";

export function formatImport(code: CodeBuilder, node: CstNode): void {
    if (node.type !== "Import") {
        throw new Error("Invalid import node");
    }

    const path = childByField(node, "path");
    if (!path) {
        throw new Error("Invalid import node structure");
    }
    const value = childByType(path, "value");
    if (!value) {
        throw new Error("Invalid import node structure");
    }

    code.add("import");
    code.space();
    formatExpression(code, path)
    code.add(";");
}
