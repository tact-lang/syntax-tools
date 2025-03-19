import {Cst, CstNode} from "../result";
import {childByField, childByType, childrenByType, textOfId, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {idText} from "./format-helpers";

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
        case "TypeId":
            code.add(textOfId(node))
            break;
        case "name":
            code.add(visit(node).trim())
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
    const child = childByField(node, "child");
    if (!child) {
        throw new Error("Invalid regular type");
    }

    code.add(textOfId(child))

    const trailingComments = child.children.slice(1).filter(child => child.$ === "node" && child.type === "Comment");
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
    const args = childByType(node, "args");

    if (!name || !args) {
        throw new Error("Invalid generic type");
    }

    formatType(code, name);

    const typeArgs = childrenByType(args, "TypeAs");
    if (typeArgs.length > 0) {
        code.add("<");
        typeArgs.forEach((arg, i) => {
            formatType(code, arg);
            if (i < typeArgs.length - 1) {
                code.add(",").space();
            }
        })
        code.add(">");
    }
};

const formatTypeAs = (code: CodeBuilder, node: CstNode): void => {
    const type = childByField(node, "type");
    const asTypes = childByType(node, "as") as CstNode

    if (!type) {
        throw new Error("Invalid 'as' type");
    }

    formatType(code, type);

    if (asTypes) {
        const children = asTypes.children.find((child) => child.$ === "node");

        if (children) {
            code.space().add("as").space();
            code.add(idText(children))
        }
    }
};

const formatTypeOptional = (code: CodeBuilder, node: CstNode): void => {
    const type = childByType(node, "TypeRegular");
    if (type) {
        formatType(code, type);
    }

    const typeGeneric = childByType(node, "TypeGeneric");
    if (typeGeneric) {
        formatType(code, typeGeneric);
    }

    const optionals = childrenByType(node, "optionals");
    for (const _ of optionals) {
        code.add("?");
    }
}; 
