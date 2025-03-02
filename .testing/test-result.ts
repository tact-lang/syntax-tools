import {createContext, Builder, space, skip, Module, Cst, CstNode} from "./result";
import {inspect} from "util";
import * as fs from "fs";

const log = (obj: unknown) => console.log(inspect(obj, {colors: true, depth: Infinity}));

const code = fs.readFileSync("jetton_wallet.tact", "utf8");

`
// hello world
// some other comment
fun bar(a: Int, other: String /* comment */): String {
    let some: Int = other;
}

/* 

some comment

*/

`;

const ctx = createContext(code, space);

const b: Builder = []

const flattenSingleChildNodes = (node: Cst): Cst => {
    if (node.$ === "leaf") {
        return node;
    }

    const processedChildren = node.children.map(c => flattenSingleChildNodes(c));

    if (
        processedChildren.length === 1 &&
        processedChildren[0].$ === "leaf" &&
        (node.type === "" || isLowerCase(node.type[0]))
    ) {
        return processedChildren[0]
    }

    if (
        processedChildren.length === 1 &&
        processedChildren[0].$ !== "leaf" &&
        (processedChildren[0].type === "" || isLowerCase(processedChildren[0].type[0]))
    ) {
        return {
            ...processedChildren[0],
            type: node.type.length === 0 ? processedChildren[0].type : node.type
        };
    }

    return {
        ...node,
        children: processedChildren
    };
};

const removeEmptyTypeNodes = (node: Cst): Cst => {
    if (node.$ === "leaf") {
        return node;
    }

    const children = node.children.flatMap(child => {
        if (child.$ === "node" && (child.type === "" || child.type === "inter")) {
            return child.children.map(c => removeEmptyTypeNodes(c))
        }

        return removeEmptyTypeNodes(child);
    })

    return {
        ...node,
        children
    };
}

const visualizeCST = (node: Cst, indent: string = ""): string => {
    if (node.$ === "leaf") {
        const text = node.text.replace(/\n/g, "\\n").substring(0, 30);
        return `${indent}"${text}${node.text.length > 30 ? "..." : ""}"`;
    }

    let result = `${indent}${node.type}`;

    if (node.children.length === 0) {
        return `${result} (empty)`;
    }

    result += "\n";

    const childrenOutput = node.children
        .map(child => visualizeCST(child, indent + "  "))
        .join("\n");

    return result + childrenOutput;
};

const cstToSExpr = (node: Cst): string => {
    if (node.$ === "leaf") {
        const escapedText = node.text
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n");

        const displayText = escapedText.length > 20
            ? escapedText.substring(0, 20) + "..."
            : escapedText;

        return `"${displayText}"`;
    }

    if (node.children.length === 0) {
        return `(${node.type})`;
    }

    const childrenSExprs = node.children
        .filter(c => c.$ === "node")
        .map(c => cstToSExpr(c))
        .join(" ").trim();

    if ((node.type.length === 0 || isLowerCase(node.type[0])) && childrenSExprs.length === 0) {
        return ""
    }

    if (childrenSExprs.length === 0) {
        return `(${node.type})`
    }

    if (node.type === "" || isLowerCase(node.type[0])) {
        return `(${childrenSExprs})`;
    }

    return `(${node.type} ${childrenSExprs})`;
};

function isLowerCase(str: string) {
    return str === str.toLowerCase() &&
        str !== str.toUpperCase();
}

skip(ctx, b)
const res = Module(ctx, b)

log(res)
log(b)

const visit = (node: Cst): string => {
    if (node.$ === "leaf") return node.text
    return node.children.map(it => visit(it)).join("")
}

const rootCst = CstNode(b, "Root");
const flattenedCst = removeEmptyTypeNodes(flattenSingleChildNodes(rootCst));

console.log(visualizeCST(flattenedCst));
fs.writeFileSync("out.json", JSON.stringify(flattenedCst, null, 4));
console.log(visit(flattenedCst));

// console.log(cstToSExpr(flattenedCst));

// const files = fs.globSync("**/*.tact", {
//     cwd: "/Users/petrmakhnev/tact",
//     withFileTypes: false,
//     exclude: (file): boolean => {
//         return file.includes("renamer-expected") || file.includes("test-failed") || file === "config.tact"
//     },
// })
//
// files.forEach(file => {
//     const content = fs.readFileSync(path.join("/Users/petrmakhnev/tact", file), "utf8");
//     const ctx = createContext(content, space);
//     const b: Builder = []
//     skip(ctx, b)
//     const res = Module(ctx, b)
//     if (!res) {
//         throw new Error(`cannot parse: ${file}`)
//     }
//
//     const equal = visit(CstNode(b)) === content
//     if (!equal) {
//         throw new Error(`not equal text: ${file}`)
//     }
// })

console.log(visit(CstNode(b, "Root")) === code)

fs.writeFileSync("out.tact", visit(CstNode(b, "Root")))
