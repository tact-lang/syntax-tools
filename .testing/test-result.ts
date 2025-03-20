import {Builder, createContext, Cst, CstNode, Module, skip, space} from "./result";
import {inspect} from "util";
import * as fs from "fs";
import {format} from "./formatter/formatter";
import {simplifyCst} from "./simplify-cst";
import {processDocComments} from "./process-comments";

const log = (obj: unknown) => console.log(inspect(obj, {colors: true, depth: Infinity}));

const code = // fs.readFileSync("jetton-minter-discoverable.tact", "utf8");

    // struct Foo {
    //     name: String;
    //     value: Int;
    // }

`
primitive Int;

asm fun foo() {}

trait Foo {}

struct Foo {}
message Foo {}

// Some comment
@name("foo")
native foo();

contract Foo {}

// comment
contract Foo {
    foo: Int;

    // comment
    // comment
    // comment
    bar: Int;
    
    // comment
    const FOO: Int;
    
    // comment 1
    get fun foo() {}
    
    // comment 2
    receive() {}
    
    // comment 3
    init() {}
    
    /// comment 4
    bar: Int = 100;
}

`;

`
const Foo: Int = 10; // inline comment

// comment
fun foo() {} // inline comment

// comment
contract Foo {}

// comment
fun foo() {
    let a = 100;
}
`;

`
primitive Int;

struct Foo {}
message(0x100) Foo {
    val: Int as uint64;
}

const Foo: Int = 100;
const Foo: Int;

extends inline fun foo(self: Int) {}

@name("name")
inline native foo(param: Int): Int;

asm(a b c -> 0 1 2) inline fun bar(foo: Int): Int { FOO }
asm fun bar(): Int {
    NEWC
    STI 10
    b{} STSLICE
    ENDC
}

@interface("hello")
@interface("hello")
contract Foo(param: Int) with Ownable, Baz {
    foo: Int = 100;
    receive(p: Param){
        let a: Ty = 10;
        a += 100;
        
        a ? 100 : 200;
       
        Bar {
            name: "John",
            value: 100,
            some,
        };
        
        let Foo { name, foo: bar, .. } = foo();
        let Foo { name, 
        foo: bar, .. } = foo();
        
        if (true) {}
        else if (false) {}
        else {}
        
        do {} until (true);
       
        initOf Foo(1, 2, 3);
        codeOf Foo;
       
        try {} catch (e) {}
    }
    
    init(foo: Int) {}
    
    receive("hello") {}
    
    get fun foo() {}
    get(10) fun foo() {}
}
`;


// message(100 + 200) Foo {
//     value: Int = 0;
// }
//
// inline fun some() {
//     Foo { name };
//     foo()
//         .other(
//         1, 2, bar()
//         .some().param)
//         .call();
// }

// foo()
//     .other(1, 2,
//         bar()
//             .some()
//             .param
//     ).call();

const ctx = createContext(code, space);

const b: Builder = []

const visualizeCST = (node: Cst, field: undefined | string, indent: string = ""): string => {
    const fieldRepr = field ? `${field}: ` : ""
    if (node.$ === "leaf") {
        const text = node.text.replace(/\n/g, "\\n").substring(0, 30);
        return `${indent}${fieldRepr}"${text}${node.text.length > 30 ? "..." : ""}"`;
    }

    let result = `${indent}${fieldRepr}${node.type}`;

    if (node.children.length === 0) {
        return `${result} (empty)`;
    }

    result += "\n";

    const childrenOutput = node.children
        .map(child => visualizeCST(child, child.$ === "node" ? child.field : undefined, indent + "  "))
        .join("\n");

    return result + childrenOutput;
};

skip(ctx, b)
const isParsed = Module(ctx, b)
log(isParsed)

const visit = (node: Cst): string => {
    if (node.$ === "leaf") return node.text
    return node.children.map(it => visit(it)).join("")
}

const root = processDocComments(simplifyCst(CstNode(b, "Root")));

console.log(visualizeCST(root, undefined));
fs.writeFileSync("out.json", JSON.stringify(root, null, 4));
console.log(visit(root));

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

fs.writeFileSync("out.tact", visit(root))
console.log(visit(root) === code)

console.log(format(root));

fs.writeFileSync("minter.fmt.tact", format(root))

// const module = childByType(root, "Module")!
// const itemsNode = childByField(module, "items")
// const items = childrenByGroup(itemsNode, "moduleItem")!
//
// for (const item of items) {
//     if (item.$ === "node" && item.type === "$Function") {
//         console.log(format(item));
//
//         console.log(idText(childByField(item, "name")))
//         const paramsNode = childByField(item, "parameters");
//         console.log(childrenByType(paramsNode, "Parameter").map(p => {
//             return idText(childByField(p, "name"))
//         }))
//     }
// }















