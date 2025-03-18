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

    // Format attributes if present
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

    // Add function declaration
    code.add("fun").space().add(visit(name));

    // Format parameters
    const params = childrenByType(parameters, "Parameter");
    const paramStrings = params.map(param => {
        const paramName = childByField(param, "name");
        const paramType = childByField(param, "type");
        if (!paramName || !paramType) {
            throw new Error("Invalid parameter node");
        }
        const paramCode = new CodeBuilder();
        paramCode.add(visit(paramName));
        formatAscription(paramCode, paramType);
        return paramCode.toString();
    });

    // Add comments between parameters
    const paramComments = params.map((param, i) => {
        const nextParam = params[i + 1];
        if (!nextParam) return [];
        return getCommentsBetween(parameters, param, nextParam);
    }).flat();

    formatCommaSeparatedList(code, paramStrings, {
        forceMultiline: paramComments.length > 0
    });

    // Add return type if present
    if (returnType) {
        code.space();
        formatAscription(code, returnType);
    }

    // Format body
    if (body.type === "FunctionDefinition") {
        code.space();
        formatStatements(code, body);
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
