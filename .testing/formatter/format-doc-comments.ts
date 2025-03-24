import {CstNode} from "../result"
import {childByField, childrenByType, visit} from "../cst-helpers"
import {CodeBuilder} from "../code-builder"

export const formatDocComments = (code: CodeBuilder, node: CstNode): void => {
    const docNode = childByField(node, "doc")
    if (!docNode) return

    const comments = childrenByType(docNode, "Comment")
    if (comments.length > 0) {
        comments.forEach(comment => {
            code.add(visit(comment).trim())
            code.newLine()
        })
    }
}
