import {Builder, createContext, CstNode, Module, skip, space} from "./result";
import {processDocComments} from "./process-comments";
import {simplifyCst} from "./simplify-cst";
import * as fs from "fs";
import {format} from "./formatter/formatter";
import * as path from "node:path";

function formatCode(code: string) {
    const ctx = createContext(code, space);
    const b: Builder = []
    skip(ctx, b)
    const isParsed = Module(ctx, b)
    if (!isParsed) {
        throw new Error("cannot parse")
    }

    const root = processDocComments(simplifyCst(CstNode(b, "Root")));
    return format(root);
}

const args = process.argv.slice(2)
const firstArg = args.shift()!

if (!fs.statSync(firstArg).isFile()) {
    const files = fs.globSync("**/*.tact", {
        cwd: "/Users/petrmakhnev/tact",
        withFileTypes: false,
        exclude: (file): boolean => {
            return file.includes("renamer-expected") || file.includes("test-failed") || file === "config.tact"
        },
    })

    files.forEach(file => {
        const basePath = "/Users/petrmakhnev/tact";
        const fullPath = path.join(basePath, file);

        if (fullPath.includes("grammar/test")) {
            return
        }

        const content = fs.readFileSync(fullPath, "utf8");
        const result = formatCode(content);

        if (result === content) {
            // console.log("already formatted")
            return
        }

        console.log(`reformat ${file}`)
        fs.writeFileSync(fullPath, result)
    })

    process.exit(0);
}


const code = fs.readFileSync(`${process.cwd()}/${firstArg}`, "utf8");

const result = formatCode(code);

const name = path.basename(firstArg)
fs.writeFileSync(`${name}.fmt.tact`, result)

