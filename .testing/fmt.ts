import {Builder, createContext, CstNode, Module, skip, space} from "./result";
import {processDocComments} from "./process-comments";
import {simplifyCst} from "./simplify-cst";
import * as fs from "fs";
import {format} from "./formatter/formatter";
import * as path from "node:path";

const args = process.argv.slice(2)
const firstArg = args.shift()!

const code = fs.readFileSync(`${process.cwd()}/${firstArg}`, "utf8");

const ctx = createContext(code, space);
const b: Builder = []
skip(ctx, b)
const isParsed = Module(ctx, b)
if (!isParsed) {
    throw new Error("cannot parse")
}

const root = processDocComments(simplifyCst(CstNode(b, "Root")));

const name = path.basename(firstArg)
fs.writeFileSync(`${name}.fmt.tact`, format(root))

