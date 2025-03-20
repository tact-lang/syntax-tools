import {Cst, CstNode} from "../result";
import {childByField, childByType, childrenByType, nonLeafChild, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatCommaSeparatedList, idText} from "./format-helpers";
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
    if (attributes) {
        if (attributes.type === "FunctionAttribute") {
            // single attribute
            formatAttribute(code, attributes);
        } else {
            const attrs = childrenByType(attributes, "FunctionAttribute");
            for (const attr of attrs) {
                formatAttribute(code, attr);
            }
        }
    }

    code.add("fun").space().add(visit(name));

    formatCommaSeparatedList(code, parameters, formatParameter);

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
            code.add("(")
            // get(0x1000) fun foo() {}
            //     ^^^^^^ this
            const value = nonLeafChild(methodIdOpt)
            formatExpression(code, value)
            code.add(")")
        }
    } else {
        code.add(`${idText(attr)}`);
    }
    code.space();
}
