import {Builder, createContext, Cst, CstNode, Module, skip, space} from "./result";
import {inspect} from "util";
import * as fs from "fs";
import {format} from "./formatter/formatter";
import {simplifyCst} from "./simplify-cst";
import {processDocComments} from "./process-comments";
import {visualizeCST} from "./cst-helpers";

const log = (obj: unknown) => console.log(inspect(obj, {colors: true, depth: Infinity}));

const code = // fs.readFileSync("jetton-minter-discoverable.tact", "utf8");
// const code = fs.readFileSync("/Users/petrmakhnev/tact/src/stdlib/stdlib/std/internal/address.tact", "utf8");

    // struct Foo {
    //     name: String;
    //     value: Int;
    // }

`
contract Foo {
    fun foo() {}
}
`;

`
fun foo() {
    do {} until (true); // comment 1
       
    try {} catch (e) {} // comment
    try {} // comment
    
    foreach (a, b in foo) {} // comment
    
    // top comment 1
    if (true) {} // comment 1 
    // top comment 2
    if (true) {} else {} // comment 2
    // top comment 4
    if (true) {} else if (true) {} // comment 3
    // top comment 4
    if (true) {} else if (true) {} else {} // comment 4
       
    // comment1
    let Foo { a } = value(); // comment
}
`;

`
// comment
import "";
// other comment
import ""; // inline comment

// comment
fun foo() {}
`;

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

const visit = (node: Cst): string => {
    if (node.$ === "leaf") return node.text
    return node.children.map(it => visit(it)).join("")
}

const ctx = createContext(code, space);
const b: Builder = []
skip(ctx, b)
const isParsed = Module(ctx, b)
log(isParsed)

const root = processDocComments(simplifyCst(CstNode(b, "Root")));

console.log(visualizeCST(root, undefined));
fs.writeFileSync("out.json", JSON.stringify(root, null, 4));

console.log(visit(root) === code)

const result = format(root);
console.log(result);

fs.writeFileSync("minter.fmt.tact", result)


// console.log(visit(root));

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

// const module = childByType(root, "Module")!
// const itemsNode = childByField(module, "items")
// const items = childrenByGroup(itemsNode, "moduleItem")!
//
// for (const item of items) {
//     const doc = childByField(item, "doc")
//     const name = childByField(item, "name")
//     if (doc && name) {
//         console.log("\n");
//         console.log("Documentation of: " + idText(name));
//         console.log();
//         doc.children.forEach((child) => {
//             if (child.$ === "node" && child.type === "Comment") {
//                 const lastLeaf = child.children.at(-1) as CstLeaf
//                 console.log(lastLeaf.text.slice(1).trim())
//             }
//         })
//     }
//
// //     if (item.$ === "node" && item.type === "$Function") {
// //         console.log(format(item));
// //
// //         console.log(idText(childByField(item, "name")))
// //         const paramsNode = childByField(item, "parameters");
// //         console.log(childrenByType(paramsNode, "Parameter").map(p => {
// //             return idText(childByField(p, "name"))
// //         }))
// //     }
// }















