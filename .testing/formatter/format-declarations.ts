import {Cst, CstNode} from "../result";
import {childByField, childByType, childrenByType, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList, idText} from "./format-helpers";
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
        attrs.forEach((attr) => {
            const attrName = childByField(attr, "name");
            if (!attrName) return;
            const child = attrName.children[0]
            if (child.$ === "node" && child.type === "GetAttribute") {
                code.add("get")
            } else {
                code.add(`${idText(attr)}`);
            }
            code.space();
        });
    }

    code.add("fun").space().add(visit(name));

    formatCommaSeparatedList(code, parameters, (code, param) => {
        const paramName = childByField(param, "name");
        const paramType = childByField(param, "type");
        if (!paramName || !paramType) {
            throw new Error("Invalid parameter node");
        }
        code.add(idText(paramName));
        formatAscription(code, paramType);
    });

    if (returnType) {
        formatAscription(code, returnType);
    }

    const bodyNode = body.children[0]

    if (bodyNode.$ === "node" && bodyNode.type === "FunctionDefinition") {
        code.space();
        formatStatements(code, childByField(bodyNode, "body"));
    } else {
        code.add(";");
    }
};
