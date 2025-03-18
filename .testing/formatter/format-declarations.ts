import {Cst, CstNode} from "../result";
import {childByField, childrenByType, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList} from "./format-helpers";
import {formatAscription} from "./format-types";
import {formatStatements} from "./format-statements";

export const formatFunction = (code: CodeBuilder, node: CstNode): void => {
    const name = childByField(node, "name");
    const parameters = childByField(node, "parameters");
    const returnType = childByField(node, "returnType");
    const body = childByField(node, "body");

    if (!name || !parameters || !body) {
        throw new Error("Invalid function node");
    }

    const attributes = childByField(node, "attributes");
    if (attributes) {
        const attrs = childrenByType(attributes, "FunctionAttribute");
        attrs.forEach((attr, i) => {
            const attrName = childByField(attr, "name");
            if (!attrName) return;
            code.add(`@${visit(attrName)}`);
            if (i < attrs.length - 1) code.space();
        });
        if (attrs.length > 0) code.newLine();
    }

    code.add("fun").space().add(visit(name));

    formatCommaSeparatedList(code, parameters, (code, param) => {
        const paramName = childByField(param, "name");
        const paramType = childByField(param, "type");
        if (!paramName || !paramType) {
            throw new Error("Invalid parameter node");
        }
        code.add(visit(paramName));
        formatAscription(code, paramType);
    });

    // Add return type if present
    if (returnType) {
        code.space();
        formatAscription(code, returnType);
    }

    const bodyNode = body.children[0]

    if (bodyNode.$ === "node" && bodyNode.type === "FunctionDefinition") {
        code.space();
        formatStatements(code, bodyNode);
    } else {
        code.add(";");
    }
};

// Helper function to get comments between nodes
const getCommentsBetween = (node: CstNode, startNode: Cst | null, endNode: Cst | null): CstNode[] => {
    return node.children.filter(child => {
        if (child.$ !== "node" || child.type !== "Comment") return false;

        const childIndex = node.children.indexOf(child);
        const startIndex = startNode ? node.children.indexOf(startNode) : -1;
        const endIndex = endNode ? node.children.indexOf(endNode) : node.children.length;

        return childIndex > startIndex && childIndex < endIndex;
    }) as CstNode[];
};
