import {Cst, CstNode} from "../result";
import {childByField, childByType, childrenByType, nonLeafChild, textOfId, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {idText} from "./format-helpers";

export const formatDocComments = (code: CodeBuilder, node: CstNode): void => {
    const docNode = childByField(node, "doc")
    if (!docNode) return

    const comments = docNode.children.filter(it => it.$ === "node" && it.type === "Comment")
    if (comments.length > 0) {
        comments.forEach((comment) => {
            code.add(visit(comment).trim())
            code.newLine()
        })
    }
};
