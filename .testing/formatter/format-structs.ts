import {CstNode} from "../result";
import {childByField, nonLeafChild} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {idText} from "./format-helpers";
import {formatExpression} from "./format-expressions";
import {formatFieldDecl} from "./format-contracts";

export function formatStruct(code: CodeBuilder, node: CstNode): void {
    code.add("struct").space().add(getName(node, "struct"));
    formatFields(code, node);
}

export function formatMessage(code: CodeBuilder, node: CstNode): void {
    code.add("message");

    // message(0x100) Foo {}
    //         ^^^^^ this
    const opcodeOpt = childByField(node, "opcode");
    if (opcodeOpt) {
        code.add("(");
        const expression = nonLeafChild(opcodeOpt)
        if (expression) {
            formatExpression(code, expression);
        }
        code.add(")");
    }

    code.space().add(getName(node, "message"));
    formatFields(code, node);
}

function formatFields(code: CodeBuilder, node: CstNode): void {
    code.space().add("{").newLine().indent();

    const fieldsNode = childByField(node, "fields");
    if (fieldsNode) {
        const fields = fieldsNode.children.filter(field => field.$ === "node" && field.type === "FieldDecl")
        fields.forEach((field) => {
            formatFieldDecl(code, field);
            code.newLine()
        })
    }

    code.dedent().add("}");
}

function getName(node: CstNode, type: "struct" | "message"): string {
    const name = childByField(node, "name");
    if (!name || name.$ !== "node" || name.type !== "TypeId") {
        throw new Error(`Invalid ${type} name`);
    }
    return idText(name);
}
