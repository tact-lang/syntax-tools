import {Cst, CstNode} from "../result";
import {childByField, childByType, childrenByType, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList, idText} from "./format-helpers";
import {formatFunction} from "./format-declarations";
import {formatStatements} from "./format-statements";
import {formatAscription} from "./format-types";
import {formatExpression} from "./format-expressions";

export function formatContract(code: CodeBuilder, node: CstNode): void {
    formatContractTraitAttributes(code, node);
    code.add("contract").space().add(getName(node, "contract"));
    formatContractParameters(code, node);
    formatInheritedTraits(code, node);
    formatContractTraitBody(code, node, (code, decl) => {
        switch (decl.type) {
            case "ContractInit":
                formatContractInit(code, decl);
                break;
            case "Receiver":
                formatReceiver(code, decl);
                break;
            case "$Function":
                formatFunction(code, decl);
                break;
            case "Constant":
                formatConstant(code, decl);
                break;
            case "FieldDecl":
                formatFieldDecl(code, decl);
                break;
            default:
                throw new Error(`Unknown contract declaration type: ${decl.type}`);
        }
    });
}

export function formatTrait(code: CodeBuilder, node: CstNode): void {
    formatContractTraitAttributes(code, node);
    code.add("trait").space().add(getName(node, "trait"));
    formatInheritedTraits(code, node);
    formatContractTraitBody(code, node, (code, decl) => {
        switch (decl.type) {
            case "Receiver":
                formatReceiver(code, decl);
                break;
            case "$Function":
                formatFunction(code, decl);
                break;
            case "Constant":
                formatConstant(code, decl);
                break;
            case "FieldDecl":
                formatFieldDecl(code, decl);
                break;
            default:
                throw new Error(`Unknown trait declaration type: ${decl.type}`);
        }
    });
}

function formatContractInit(code: CodeBuilder, decl: CstNode): void {
    code.add("init");
    const initParams = childByField(decl, "parameters");
    if (initParams) {
        formatCommaSeparatedList(code, initParams, (code, param) => {
            const name = childByField(param, "name");
            const type = childByField(param, "type");
            if (!name || !type) {
                throw new Error("Invalid init parameter");
            }
            code.add(idText(name));
            formatAscription(code, type)
        });
    }
    const initBody = childByField(decl, "body");
    if (initBody) {
        code.space();
        formatStatements(code, initBody);
    }
}

function formatReceiver(code: CodeBuilder, decl: CstNode): void {
    const receiverType = childByField(decl, "type");
    const receiverParam = childByType(decl, "param");
    const receiverBody = childByField(decl, "body");

    if (!receiverType || !receiverBody) {
        throw new Error("Invalid receiver declaration");
    }

    const typeName = childByType(receiverType, "name");
    if (!typeName) {
        throw new Error("Invalid receiver type");
    }

    code.add(visit(typeName));
    if (receiverParam) {
        code.add("(");
        if (receiverParam.$ === "node" && receiverParam.type === "Parameter") {
            const name = childByField(receiverParam, "name");
            const type = childByField(receiverParam, "type");
            if (!name || !type) {
                throw new Error("Invalid receiver parameter");
            }
            code.add(idText(name));
            formatAscription(code, type)
        } else {
            code.add(visit(receiverParam));
        }
        code.add(")");
    } else {
        code.add("()");
    }
    code.space();
    formatStatements(code, receiverBody);
}

function formatConstant(code: CodeBuilder, decl: CstNode): void {
    const constName = childByField(decl, "name");
    const constType = childByField(decl, "type");
    const constBody = childByField(decl, "body");

    if (!constName || !constType) {
        throw new Error("Invalid constant declaration");
    }

    code.add("const").space().add(idText(constName));
    formatAscription(code, constType)

    const constBodyChild = constBody.children[0]
    if (constBodyChild && constBodyChild.$ === "node" && constBodyChild.type === "ConstantDefinition") {
        code.space().add("=").space();
        formatExpression(code, constBodyChild.children.find(it => it.$ === "node"))
    }
    code.add(";");
}

export function formatFieldDecl(code: CodeBuilder, decl: Cst): void {
    const varName = childByField(decl, "name");
    const varType = childByField(decl, "type");
    const varInit = childByType(decl, "expression");

    if (!varName || !varType) {
        throw new Error("Invalid field declaration");
    }

    code.add(idText(varName));
    formatAscription(code, varType)

    if (varInit && varInit.$ === "node") {
        code.space().add("=").space();
        formatExpression(code, varInit.children.find(it => it.$ === "node"))
    }
    code.add(";");
}

function getName(node: CstNode, type: "contract" | "trait"): string {
    const name = childByField(node, "name");
    if (!name || name.$ !== "node" || name.type !== "Id") {
        throw new Error(`Invalid ${type} name`);
    }
    return idText(name);
}

function formatContractTraitAttributes(code: CodeBuilder, node: CstNode): void {
    const attributes = childByField(node, "attributes");
    if (!attributes) return;

    const attrs = childrenByType(attributes, "ContractAttribute");
    attrs.forEach((attr, i) => {
        const name = childByField(attr, "name");
        if (!name) return;
        code.add("@interface");
        code.add("(").add(visit(name)).add(")");
        if (i < attrs.length - 1) code.space();
    });
    if (attrs.length > 0) code.newLine();
}

function formatInheritedTraits(code: CodeBuilder, node: CstNode): void {
    const traits = childByType(node, "traits");
    if (traits && traits.$ === "node") {
        code.space().add("with").space();
        const children = traits.children
        const namesIndex = children.findIndex(it => it.$ === "node" && it.type === "Id");

        formatCommaSeparatedList(code, traits, (code, trait) => {
            code.add(idText(trait));
        }, {
            wrapperLeft: "",
            wrapperRight: "",
            startIndex: namesIndex,
            endIndex: 0,
        });
    }
}

function formatContractParameters(code: CodeBuilder, node: CstNode): void {
    const parameters = childByField(node, "parameters");
    if (!parameters) return;

    formatCommaSeparatedList(code, childByType(parameters, "ParameterList") as CstNode, (code, param) => {
        const paramName = childByField(param, "name");
        const paramType = childByField(param, "type");
        if (!paramName || !paramType) {
            throw new Error("Invalid contract parameter");
        }
        code.add(idText(paramName));
        formatAscription(code, paramType)
    });
}

function formatContractTraitBody(code: CodeBuilder, node: CstNode, formatDeclaration: (code: CodeBuilder, decl: CstNode) => void): void {
    code.space().add("{").newLine().indent();

    const declarations = childByField(node, "declarations");
    if (declarations) {
        declarations.children.forEach((decl, index) => {
            if (decl.$ !== "node") return;

            formatDeclaration(code, decl);
            code.newLine();

            if (index < declarations.children.length - 1) {
                code.newLine();
            }
        });
    }

    code.dedent().add("}");
}
