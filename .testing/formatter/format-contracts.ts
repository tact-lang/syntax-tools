import {Cst, CstNode} from "../result";
import {childByField, childrenByType, nonLeafChild, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatId, formatSeparatedList, idText} from "./format-helpers";
import {formatFunction, formatParameter} from "./format-declarations";
import {formatStatements, processInlineCommentsAfterIndex} from "./format-statements";
import {formatAscription} from "./format-types";
import {formatExpression} from "./format-expressions";
import {formatDocComments} from "./format-doc-comments";

export function formatContract(code: CodeBuilder, node: CstNode): void {
    formatDocComments(code, node)

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
            case "Comment":
                code.add(visit(decl).trim());
                break;
            default:
                throw new Error(`Unknown contract declaration type: ${decl.type}`);
        }
    });
}

export function formatTrait(code: CodeBuilder, node: CstNode): void {
    formatDocComments(code, node)

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
            case "Comment":
                code.add(visit(decl).trim());
                break;
            default:
                throw new Error(`Unknown trait declaration type: ${decl.type}`);
        }
    });
}

function formatContractInit(code: CodeBuilder, decl: CstNode): void {
    formatDocComments(code, decl)

    code.add("init");

    // init(foo: Int) {}
    //      ^^^^^^^^
    const paramsOpt = childByField(decl, "parameters");
    if (paramsOpt) {
        formatSeparatedList(code, paramsOpt, formatParameter);
    }

    const body = childByField(decl, "body");
    if (!body) {
        throw new Error("Invalid contract init declaration");
    }

    code.space();
    formatStatements(code, body);
}

function formatReceiver(code: CodeBuilder, decl: CstNode): void {
    formatDocComments(code, decl)

    // receive(param: Message) {}
    // ^^^^^^^ ^^^^^^^^^^^^^^  ^^
    // |       |               |
    // |       |               body
    // |       paramOpt
    // type
    const type = childByField(decl, "type");
    const paramOpt = childByField(decl, "param");
    const body = childByField(decl, "body");

    if (!type || !body) {
        throw new Error("Invalid receiver declaration");
    }

    // receive/external/bounced
    const receiverKind = childByField(type, "name");
    if (!receiverKind) {
        throw new Error("Invalid receiver type");
    }

    code.add(visit(receiverKind));
    if (paramOpt) {
        code.add("(");
        if (paramOpt.type === "Parameter") {
            // receive(param: Slice) {}
            //         ^^^^^^^^^^^^ this
            formatParameter(code, paramOpt)
        } else if (paramOpt.type === "StringLiteral") {
            // receive("hello") {}
            //         ^^^^^^^ this
            formatExpression(code, paramOpt);
        }
        code.add(")");
    } else {
        code.add("()");
    }
    code.space();
    formatStatements(code, body);
}

export function formatConstant(code: CodeBuilder, decl: CstNode): void {
    formatDocComments(code, decl)

    // const Foo : Int = 100;
    //       ^^^ ^^^^^ ^^^^^
    //       |   |     |
    //       |   |     bodyOpt
    //       |   type
    //       name
    const name = childByField(decl, "name");
    const type = childByField(decl, "type");
    const bodyOpt = childByField(decl, "body");

    if (!name || !type) {
        throw new Error("Invalid constant declaration");
    }

    // const FOO: Int
    code.add("const").space().apply(formatId, name).apply(formatAscription, type);

    if (bodyOpt && bodyOpt.type === "ConstantDefinition") {
        // const Foo: Int = 100;
        //               ^^^^^^^ this
        code.space().add("=").space();
        // const Foo: Int = 100;
        //                  ^^^ this
        const value = nonLeafChild(bodyOpt);
        code.apply(formatExpression, value).add(";");

        const comments = bodyOpt.children.filter(it => it.$ === "node" && it.type === "Comment");
        if (comments.length > 0) {
            code.space();
            comments.forEach(comment => {
                code.add(visit(comment))
            })
        }
    } else if (!bodyOpt || bodyOpt.type === "ConstantDeclaration") {
        // const Foo: Int;
        //               ^ this
        code.add(";");
    }
}

export function formatFieldDecl(code: CodeBuilder, decl: CstNode): void {
    formatDocComments(code, decl)

    // foo : Int = 100;
    // ^^^ ^^^^^   ^^^
    // |   |       |
    // |   |       initOpt
    // |   type
    // name
    const name = childByField(decl, "name");
    const type = childByField(decl, "type");
    const initOpt = childByField(decl, "expression");

    if (!name || !type) {
        throw new Error("Invalid field declaration");
    }

    // foo: Int
    code.apply(formatId, name).apply(formatAscription, type);

    if (initOpt) {
        // foo: Int = 100;
        //            ^^^ this
        const value = nonLeafChild(initOpt);
        //  = 100
        code.space().add("=").space().apply(formatExpression, value);
    }
    code.add(";");

    const endIndex = decl.children.findIndex(it => it.$ === "leaf" && it.text === ";")
    processInlineCommentsAfterIndex(code, decl, endIndex)
}

function getName(node: CstNode, type: "contract" | "trait"): string {
    const name = childByField(node, "name");
    if (!name || name.$ !== "node" || name.type !== "Id") {
        throw new Error(`Invalid ${type} name`);
    }
    return idText(name);
}

function formatContractTraitAttribute(attr: Cst, code: CodeBuilder) {
    const name = childByField(attr, "name");
    if (!name) return;
    code.add("@interface").add("(").apply(formatExpression, name).add(")");
}

function formatContractTraitAttributes(code: CodeBuilder, node: CstNode): void {
    // @interface("name")
    // ^^^^^^^^^^^^^^^^^^ this
    // contract Foo {}
    const attributes = childByField(node, "attributes");
    if (!attributes) return;

    if (attributes.type === "ContractAttribute") {
        // single attribute
        formatContractTraitAttribute(attributes, code);
        code.newLine()
        return
    }

    const attrs = childrenByType(attributes, "ContractAttribute");
    attrs.forEach((attr, i) => {
        formatContractTraitAttribute(attr, code);
        if (i < attrs.length - 1) {
            code.newLine();
        }
    });
    if (attrs.length > 0) {
        code.newLine();
    }
}

function formatInheritedTraits(code: CodeBuilder, node: CstNode): void {
    // contract Foo with Bar, Baz {}
    //              ^^^^^^^^^^^^^ this
    const traitsOpt = childByField(node, "traits");
    if (!traitsOpt) return;

    code.space().add("with").space();

    // ["with", " ", "Bar", ", ", "Baz"]
    //               ^ starts from here
    const namesIndex = traitsOpt.children.findIndex(it => it.$ === "node" && it.type === "Id");

    formatSeparatedList(code, traitsOpt, (code, trait) => {
        code.apply(formatId, trait);
    }, {
        wrapperLeft: "",
        wrapperRight: "",
        startIndex: namesIndex,
        endIndex: 0,
    });
}

function formatContractParameters(code: CodeBuilder, node: CstNode): void {
    // contract Foo(value: Int) {}
    //             ^^^^^^^^^^^^ this
    const paramsOpt = childByField(node, "parameters");
    if (!paramsOpt) return;
    formatSeparatedList(code, paramsOpt, formatParameter);
}

function formatContractTraitBody(code: CodeBuilder, node: CstNode, formatDeclaration: (code: CodeBuilder, decl: CstNode) => void): void {
    code.space().add("{").newLine().indent();

    const declarations = childByField(node, "declarations");

    if (declarations && (declarations.type === "FieldDecl" || declarations.group === "contractItemDecl" || declarations.group === "traitItemDecl")) {
        // single decl contract
        formatDeclaration(code, declarations);
        code.newLine();
    } else {
        declarations?.children.forEach((decl, index) => {
            if (decl.$ !== "node") return;

            formatDeclaration(code, decl);
            code.newLine();

            if (index < declarations.children.length - 1) {
                code.newLine();
            }
        });
    }

    if (!declarations) {
        // empty contract
        const openBraceIndex = node.children.findIndex(it => it.$ === "leaf" && it.text === "{")
        const closeBraceIndex = node.children.findIndex(it => it.$ === "leaf" && it.text === "}")

        const comments = node.children
            .slice(openBraceIndex + 1, closeBraceIndex)
            .filter(it => it.$ === "node" && it.type === "Comment");
        comments.forEach(child => {
            code.add(visit(child).trim())
            code.newLine()
        })
    }

    code.dedent().add("}");
}
