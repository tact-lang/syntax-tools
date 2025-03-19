import {Cst} from "./result";

export const simplifyCst = (node: Cst): Cst => {
    if (node.$ === "leaf") {
        return node
    }

    if (node.type === "ParameterList") {
        return {
            ...node,
            children: node.children.flatMap(it => {
                if (it.$ === "node" && it.field === "tail") {
                    return it.children.flatMap(it => simplifyCst(it))
                }
                return simplifyCst(it)
            })
        }
    }

   if (node.type === "traits" || node.type === "fields" || node.type === "args") {
        return {
            ...node,
            children: node.children.flatMap(it => {
                if (it.$ === "node" && it.type === "tail") {
                    return it.children.flatMap(it => simplifyCst(it))
                }
                return simplifyCst(it)
            })
        }
    }

    if (node.type === "IntegerLiteral" && node.children.length === 1) {
        const child = simplifyCst(node.children[0])
        if (child.$ !== "node") return child
        const value = child.children[0];
        if (value.$ !== "node") return child
        return {
            ...node,
            children: [
                {
                    ...value,
                    field: "value"
                }
            ]
        }
    }

    if ((node.type === "Binary" || node.type === "Unary" || node.type === "Suffix" || node.type === "Conditional") && node.children.length === 1) {
        const firstChild = node.children[0]
        const result = simplifyCst(firstChild);
        if (result.$ === "leaf") return result
        return {
            ...result,
            group: node.group,
            field: node.field,
        }
    }

    if (node.type === "Binary" && node.children.length === 2) {
        const firstChild = simplifyCst(node.children[0])
        const lastChild = simplifyCst(node.children[1])
        if (firstChild.$ !== "node" || lastChild.$ !== "node") {
            return node
        }

        const [op, right, ...tail] = lastChild.children
        if (right.$ !== "node" || op.$ !== "node") {
            return node
        }

        return {
            ...node,
            children: [{
                ...firstChild,
                field: "left"
            }, {
                ...op,
                field: "op",
            }, {
                ...right,
                field: "right",
                children: [...right.children, ...tail]
            }],
        }
    }

    return {
        ...node,
        children: node.children.flatMap(it => simplifyCst(it)),
    }
};
