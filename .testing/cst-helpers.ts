import {Builder, createContext, Cst, CstLeaf, CstNode, Module, skip, space} from "./result"
import {processDocComments} from "./process-comments"
import {simplifyCst} from "./simplify-cst"

export function parseCode(code: string): undefined | Cst {
    const ctx = createContext(code, space)
    const b: Builder = []
    skip(ctx, b)
    const res = Module(ctx, b)
    if (!res) {
        return undefined
    }
    return processDocComments(simplifyCst(CstNode(b, "Root")))
}

export const visit = (node: Cst): string => {
    if (node.$ === "leaf") return node.text
    return node.children.map(it => visit(it)).join("")
}

export const childByType = (node: Cst, type: string): undefined | Cst => {
    if (node.$ === "leaf") {
        return undefined
    }

    return node.children.find(c => c.$ === "node" && c.type === type)
}

export const childIdxByType = (node: Cst, type: string): number => {
    if (node.$ === "leaf") {
        return -1
    }

    return node.children.findIndex(c => c.$ === "node" && c.type === type)
}

export const childrenByType = (node: Cst, type: string): Cst[] => {
    if (node.$ === "leaf") {
        return []
    }

    return node.children.filter(c => c.$ === "node" && c.type === type)
}

export const childrenByGroup = (node: Cst, group: string): Cst[] => {
    if (node.$ === "leaf") {
        return []
    }

    return node.children.filter(c => c.$ === "node" && c.group === group)
}

export const nonLeafChild = (node: Cst): undefined | CstNode => {
    if (node.$ === "leaf") {
        return undefined
    }

    const res = node.children.find(c => c.$ === "node")
    if (res && res.$ === "node") {
        return res
    }
    return undefined
}

export const childByField = (node: Cst, field: string): undefined | CstNode => {
    if (node.$ === "leaf") {
        return undefined
    }

    const res = node.children.find(c => c.$ === "node" && c.field === field)
    if (res && res.$ === "node") {
        return res
    }
    return undefined
}

export const childIdxByField = (node: Cst, field: string): number => {
    if (node.$ === "leaf") {
        return -1
    }

    return node.children.findIndex(c => c.$ === "node" && c.field === field)
}

export const childLeafWithText = (node: Cst, text: string): undefined | CstLeaf => {
    if (node.$ === "leaf") {
        return undefined
    }

    const res = node.children.find(c => c.$ === "leaf" && c.text === text)
    if (res && res.$ === "leaf") {
        return res
    }
    return undefined
}

export const childLeafIdxWithText = (node: Cst, text: string): number => {
    if (node.$ === "leaf") {
        return -1
    }
    return node.children.findIndex(c => c.$ === "leaf" && c.text === text)
}

export const textOfId = (node: Cst): string => {
    if (node.$ === "leaf") return node.text
    if (node.type === "Id" || node.type === "TypeId") {
        const name = childByField(node, "name")
        const first = name.children[0]
        return first.$ === "leaf" ? first.text : ""
    }
    return ""
}

export const isLowerCase = (str: string): boolean => {
    return str === str.toLowerCase() && str !== str.toUpperCase()
}

export const visualizeCST = (node: Cst, field: undefined | string, indent: string = ""): string => {
    const fieldRepr = field ? `${field}: ` : ""
    if (node.$ === "leaf") {
        const text = node.text.replace(/\n/g, "\\n").substring(0, 30)
        return `${indent}${fieldRepr}"${text}${node.text.length > 30 ? "..." : ""}"`
    }

    let result = `${indent}${fieldRepr}${node.type}`

    if (node.children.length === 0) {
        return `${result} (empty)`
    }

    result += "\n"

    const childrenOutput = node.children
        .map(child =>
            visualizeCST(child, child.$ === "node" ? child.field : undefined, indent + "  "),
        )
        .join("\n")

    return result + childrenOutput
}
