import {Cst, CstNode} from "../result";
import {childByField, childByType, childLeafWithText, childrenByType, nonLeafChild, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatSeparatedList, idText} from "./format-helpers";
import {formatAscription} from "./format-types";
import {formatStatements} from "./format-statements";
import {formatExpression} from "./format-expressions";

export const formatParameter = (code: CodeBuilder, param: CstNode): void => {
    // value: Foo
    // ^^^^^  ^^^
    // |      |
    // |      type
    // name
    const name = childByField(param, "name");
    const type = childByField(param, "type");
    if (!name || !type) {
        throw new Error("Invalid parameter");
    }
    code.add(idText(name));
    formatAscription(code, type)
}

export const formatFunction = (code: CodeBuilder, node: CstNode): void => {
    // fun foo(value: Int): Bool {}
    //     ^^^ ^^^^^^^^^^ ^^^^^^ ^^
    //     |   |          |      |
    //     |   |          |      body
    //     |   |          returnTypeOpt
    //     |   parameters
    //     name
    const name = childByField(node, "name");
    const parameters = childByField(node, "parameters");
    const returnTypeOpt = childByField(node, "returnType");
    const body = childByField(node, "body");

    if (!name || !parameters || !body) {
        throw new Error("Invalid function node");
    }

    // inline extends fun foo(self: Int) {}
    // ^^^^^^^^^^^^^^ this
    const attributes = childByField(node, "attributes");
    formatAttributes(attributes, code);

    code.add("fun").space().add(visit(name));

    formatSeparatedList(code, parameters, formatParameter);

    if (returnTypeOpt) {
        formatAscription(code, returnTypeOpt);
    }

    const bodyNode = body.children[0]

    if (bodyNode.$ === "node" && bodyNode.type === "FunctionDefinition") {
        code.space();
        formatStatements(code, childByField(bodyNode, "body"));
    } else {
        code.add(";");
    }
};

function formatAttribute(code: CodeBuilder, attr: Cst) {
    // get(100)
    // ^^^
    const attrName = childByField(attr, "name");
    if (!attrName) return;

    if (attrName.type === "GetAttribute") {
        code.add("get")
        // get(0x1000) fun foo() {}
        //    ^^^^^^^^ this
        const methodIdOpt = childByField(attrName, "methodId")
        if (methodIdOpt) {
            // get(0x1000) fun foo() {}
            //     ^^^^^^ this
            const value = nonLeafChild(methodIdOpt)
            code.add("(").apply(formatExpression, value).add(")")
        }
    } else {
        code.add(`${idText(attr)}`);
    }
    code.space();
}

export const formatNativeFunction = (code: CodeBuilder, node: CstNode): void => {
    // @name("native_name")
    // ^^^^^ ^^^^^^^^^^^^^
    // |     |
    // |     nativeName
    // name
    // 
    // inline native foo(param: Int): Int {}
    // ^^^^^^         ^^^ ^^^^^^^^^^ ^^^^^ ^^
    // attributes     |   |          |     |
    //                |   |          |     body
    //                |   |          returnTypeOpt
    //                |   parameters
    //                name
    const name = childByField(node, "name");
    const nativeName = childByField(node, "nativeName");
    const parameters = childByField(node, "parameters");
    const returnTypeOpt = childByField(node, "returnType");
    const attributes = childByField(node, "attributes");

    if (!name || !nativeName || !parameters) {
        throw new Error("Invalid native function declaration");
    }

    code.add("@name").add("(").apply(formatExpression, nativeName).add(")").newLine();

    formatAttributes(attributes, code);

    code.add("native").space().add(idText(name));

    formatSeparatedList(code, parameters, formatParameter);

    if (returnTypeOpt) {
        formatAscription(code, returnTypeOpt);
    }

    code.add(";");
};

export const formatAsmFunction = (code: CodeBuilder, node: CstNode): void => {
    // asm(a, b) inline fun foo(param: Int): Int { FOO }
    //    ^^^^^^ ^^^^^^     ^^^ ^^^^^^^^^^ ^^^^^   ^^^^
    //    |      |          |   |          |       |
    //    |      |          |   |          |       instructions
    //    |      |          |   |          returnTypeOpt
    //    |      |          |   parameters
    //    |      |          name
    //    |      attributes
    //    shuffle
    const name = childByField(node, "name");
    const parameters = childByField(node, "parameters");
    const returnTypeOpt = childByField(node, "returnType");
    const attributes = childByField(node, "attributes");
    const shuffle = childByField(node, "shuffle");
    const instructions = childByField(node, "instructions");

    if (!name || !parameters || !instructions) {
        throw new Error("Invalid asm function declaration");
    }

    code.add("asm");

    if (shuffle) {
        formatShuffle(code, shuffle);
    }

    code.space();
    formatAttributes(attributes, code);

    code.add("fun").space().add(idText(name));

    formatSeparatedList(code, parameters, formatParameter);

    if (returnTypeOpt) {
        formatAscription(code, returnTypeOpt);
    }

    code.space().add("{");

    // format instructions as is, without any changes
    const openBrace = childLeafWithText(node, "{");
    const openBraceIndex = node.children.indexOf(openBrace);
    const instructionsIndex = node.children.indexOf(instructions);
    for (let i = openBraceIndex + 1; i <= instructionsIndex; i++) {
        code.add(visit(node.children[i]))
    }

    code.add("}");
};

function formatShuffle(code: CodeBuilder, node: CstNode): void {
    // (a, b -> 1, 2)
    //  ^^^^ ^^^^^^^
    //  |    |
    //  |    to
    //  ids
    const ids = childByField(node, "ids");
    const to = childByField(node, "to");

    code.add("(");

    if (ids) {
        formatSeparatedList(code, ids, (code, id) => {
            code.add(idText(id));
        }, {
            wrapperLeft: "",
            wrapperRight: "",
            startIndex: 0,
            endIndex: 0,
            separator: "",
        });
    }

    if (to) {
        code.space().add("->").space();
        formatSeparatedList(code, to, (code, value) => {
            formatExpression(code, value);
        }, {
            wrapperLeft: "",
            wrapperRight: "",
            startIndex: 0,
            endIndex: 0,
            separator: "",
        });
    }

    code.add(")");
}

function formatAttributes(attributes: undefined | CstNode, code: CodeBuilder) {
    if (!attributes) return;

    if (attributes.type === "FunctionAttribute") {
        // single attribute
        formatAttribute(code, attributes);
        return
    }

    const attrs = childrenByType(attributes, "FunctionAttribute");
    for (const attr of attrs) {
        formatAttribute(code, attr);
    }
}

export const formatPrimitiveType = (code: CodeBuilder, node: CstNode): void => {
    // primitive Foo;
    // ^^^^^^^^^ ^^^
    // |         |
    // |         name
    // keyword
    const name = childByField(node, "name");

    if (!name) {
        throw new Error("Invalid primitive type declaration");
    }

    code.add("primitive").space().add(idText(name)).add(";");
};
