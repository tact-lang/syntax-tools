import {CstNode} from "../result";
import {childByField} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {idText} from "./format-helpers";
import {formatExpression} from "./format-expressions";
import {formatFieldDecl} from "./format-contracts";

function formatStructBody(code: CodeBuilder, node: CstNode): void {
    code.space().add("{").newLine().indent();

    const fields = childByField(node, "fields");
    if (fields) {
        const fieldsNode = fields.children.filter(field => field.$ === "node" && field.type === "FieldDecl")
        fieldsNode.forEach((field) => {
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

export function formatStruct(code: CodeBuilder, node: CstNode): void {
    code.add("struct").space().add(getName(node, "struct"));
    formatStructBody(code, node);
}

export function formatMessage(code: CodeBuilder, node: CstNode): void {
    code.add("message");

    const opcode = childByField(node, "opcode");
    if (opcode && opcode.$ === "node") {
        code.add("(");
        const expression = opcode.children.find(it => it.$ === "node")
        if (expression) {
            formatExpression(code, expression);
        }
        code.add(")");
    }

    code.space().add(getName(node, "message"));
    formatStructBody(code, node);
} 
