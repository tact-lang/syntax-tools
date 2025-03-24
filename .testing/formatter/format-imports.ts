import {childByField, childLeafIdxWithText, visit} from "../cst-helpers"
import {CstNode} from "../result"
import {CodeBuilder} from "../code-builder"
import {formatExpression} from "./format-expressions"
import {formatDocComments} from "./format-doc-comments"

export function formatImport(code: CodeBuilder, node: CstNode): void {
    formatDocComments(code, node)

    const path = childByField(node, "path")
    if (!path) {
        throw new Error("Invalid import node structure")
    }
    const value = childByField(path, "value")
    if (!value) {
        throw new Error("Invalid import node structure")
    }

    code.add("import")
    code.space()
    formatExpression(code, path)
    code.add(";")

    const semicolonIndex = childLeafIdxWithText(node, ";")

    const afterBody = node.children.slice(semicolonIndex + 1)
    const comments = afterBody.filter(it => it.$ === "node" && it.type === "Comment")
    if (comments.length > 0) {
        code.space()
        comments.forEach(comment => {
            code.add(visit(comment))
        })
    }
}
