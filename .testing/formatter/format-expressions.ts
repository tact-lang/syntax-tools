import {Cst, CstNode} from "../result";
import {childByField, childrenByType, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList} from "./format-helpers";
import {formatType} from "./format-types";

export const formatExpression = (code: CodeBuilder, node: Cst): void => {
    if (node.$ === "node") {
        switch (node.type) {
            case "StringLiteral":
                code.add(visit(node));
                return
            case "StructInstance":
                formatStructInstance(code, node);
                return
            case "SuffixCall":
                formatSuffixCall(code, node);
                return
        }
    }

    code.add(visit(node));
};

const formatStructInstance = (code: CodeBuilder, node: CstNode): void => {
    const type = childByField(node, "type");
    const fields = childByField(node, "fields");

    if (!type || !fields) {
        throw new Error("Invalid struct instance");
    }

    formatType(code, type);

    const fieldNodes = childrenByType(fields, "StructFieldInitializer");
    const fieldStrings = fieldNodes.map(field => {
        const name = childByField(field, "name");
        const init = childByField(field, "init");
        if (!name) throw new Error("Invalid field initializer");

        const fieldCode = new CodeBuilder();
        fieldCode.add(visit(name));
        if (init) {
            fieldCode.add(":").space();
            formatExpression(fieldCode, init);
        }
        return fieldCode.toString();
    });

    formatCommaSeparatedList(code, fieldStrings, {
        wrapperLeft: "{",
        wrapperRight: "}"
    });
};

const formatSuffixCall = (code: CodeBuilder, node: CstNode): void => {
    const args = childByField(node, "arguments");
    if (!args) {
        throw new Error("Invalid call expression");
    }

    const argNodes = childrenByType(args, "expression");
    const argStrings = argNodes.map(arg => {
        const argCode = new CodeBuilder();
        formatExpression(argCode, arg);
        return argCode.toString();
    });

    formatCommaSeparatedList(code, argStrings);
}; 
