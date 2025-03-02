import {createContext, Builder, space, skip, Module, Cst, CstNode} from "./result";
import { inspect } from "util";
import * as fs from "fs";
import * as path from "node:path";
const log = (obj: unknown) => console.log(inspect(obj, { colors: true, depth: Infinity }));

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

skip(ctx, b)
const res = Module(ctx, b)

log(res)
// log(b)

const visit = (node: Cst): string => {
    if (node.$ === "leaf") return node.text
    return node.children.map(it => visit(it)).join("")
}

const files = fs.globSync("**/*.tact", {
    cwd: "/Users/petrmakhnev/tact",
    withFileTypes: false,
    exclude: (file): boolean => {
        return file.includes("renamer-expected") || file.includes("test-failed") || file === "config.tact"
    },
})

console.log(visit(CstNode(b)))

files.forEach(file => {
    const content = fs.readFileSync(path.join("/Users/petrmakhnev/tact", file), "utf8");
    const ctx = createContext(content, space);
    const b: Builder = []
    skip(ctx, b)
    const res = Module(ctx, b)
    if (!res) {
        throw new Error(`cannot parse: ${file}`)
    }

    const equal = visit(CstNode(b)) === content
    if (!equal) {
        throw new Error(`not equal text: ${file}`)
    }
})

console.log(visit(CstNode(b)) === code)

fs.writeFileSync("out.tact", visit(CstNode(b)))
