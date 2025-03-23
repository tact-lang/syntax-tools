import {CstNode} from "../result";
import {childByField, nonLeafChild, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {idText} from "./format-helpers";
import {formatExpression} from "./format-expressions";
import {formatFieldDecl} from "./format-contracts";
import {formatDocComments} from "./format-doc-comments";

export function formatStruct(code: CodeBuilder, node: CstNode): void {
    formatDocComments(code, node)
    code.add("struct").space().add(getName(node, "struct"));
    formatFields(code, node);
}

export function formatMessage(code: CodeBuilder, node: CstNode): void {
    formatDocComments(code, node)
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
    const children = node.children;

    // struct can contain only comments, so we need to handle this case properly
    const hasComments = children.find(it => it.$ === "node" && it.type === "Comment");

    const fieldsNode = childByField(node, "fields");
    if ((!fieldsNode || fieldsNode.children.length === 0) && !hasComments) {
        code.space().add("{}")
        return
    }

    code.space().add("{").newLine().indent();

    children.forEach(child => {
        if (child.$ === "leaf") return

        if (child.type === "Comment") {
            code.add(visit(child).trim())
            code.newLine()
        }

        if (child.field === "fields") {
            const fields = child.children.filter(field => field.$ === "node")

            let needNewline = false
            fields.forEach((field) => {
                if (field.type === "Comment") {
                    if (needNewline) {
                        code.add(" ")
                    }
                    code.add(visit(field).trim())
                    code.newLine()
                    needNewline = false
                } else if (field.type === "FieldDecl") {
                    if (needNewline) {
                        code.newLine()
                    }
                    formatFieldDecl(code, field);
                    needNewline = true
                }
            })

            if (needNewline) {
                code.newLine()
            }
        }
    })

    code.dedent().add("}");
}

function getName(node: CstNode, type: "struct" | "message"): string {
    const name = childByField(node, "name");
    if (!name || name.$ !== "node" || name.type !== "TypeId") {
        throw new Error(`Invalid ${type} name`);
    }
    return idText(name);
}
