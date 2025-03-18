import {Cst, CstNode} from "../result";
import {childByField, childByType, childrenByType, idText, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList} from "./format-helpers";

export const formatType = (code: CodeBuilder, node: Cst): void => {
    if (node.$ !== "node") {
        code.add(visit(node));
        return;
    }

    switch (node.type) {
        case "TypeRegular":
            formatTypeRegular(code, node);
            break;
        case "TypeGeneric":
            formatTypeGeneric(code, node);
            break;
        case "TypeAs":
            formatTypeAs(code, node);
            break;
        case "TypeOptional":
            formatTypeOptional(code, node);
            break;
        default:
            code.add(visit(node));
    }
};

export const formatAscription = (code: CodeBuilder, node: Cst): void => {
    if (node.$ !== "node") {
        throw new Error("Expected node in ascription");
    }

    const type = childByType(node, "TypeAs");
    if (!type) {
        throw new Error("Invalid ascription");
    }

    code.add(":").space();
    formatType(code, type);
};

const formatTypeRegular = (code: CodeBuilder, node: CstNode): void => {
    code.add(idText(node.children[0]))

    const trailingComments = node.children.slice(1).filter(child => child.$ === "node" && child.type === "Comment");
    if (trailingComments.length > 0) {
        code.space();
        for (const comment of trailingComments) {
            const index = trailingComments.indexOf(comment);
            code.add(visit(comment));
            if (index < trailingComments.length - 1) {
                code.space();
            }
        }
    }
};

const formatTypeGeneric = (code: CodeBuilder, node: CstNode): void => {
    const name = childByField(node, "name");
    const args = childByField(node, "args");

    if (!name || !args) {
        throw new Error("Invalid generic type");
    }

    formatType(code, name);

    const typeArgs = childrenByType(args, "type");
    const argStrings = typeArgs.map(arg => {
        const argCode = new CodeBuilder();
        formatType(argCode, arg);
        return argCode.toString();
    });

    // formatCommaSeparatedList(code, argStrings, {
    //     wrapperLeft: "<",
    //     wrapperRight: ">"
    // });
};

const formatTypeAs = (code: CodeBuilder, node: CstNode): void => {
    const type = childByField(node, "type");
    const asTypes = childrenByType(node, "Id");

    if (!type) {
        throw new Error("Invalid 'as' type");
    }

    formatType(code, type);

    for (const asType of asTypes) {
        code.space().add("as").space();
        formatType(code, asType);
    }
};

const formatTypeOptional = (code: CodeBuilder, node: CstNode): void => {
    const type = childByType(node, "TypeRegular");
    const optionals = childrenByType(node, "optionals");

    if (!type) {
        throw new Error("Invalid optional type");
    }

    formatType(code, type);

    for (const _ of optionals) {
        code.add("?");
    }
}; 
