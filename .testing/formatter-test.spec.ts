import {Builder, createContext, CstNode, Module, space} from "./result";
import {format} from "./formatter/formatter";
import {simplifyCst} from "./simplify-cst";

describe('should format', () => {
    const test = (input: string, output: string) => {
        return () => {
            const ctx = createContext(input.trim(), space);
            const b: Builder = []
            const res = Module(ctx, b)
            expect(res).toBe(true);
            const root = simplifyCst(CstNode(b, "Root")) as CstNode;

            const formatted = format(root)
            expect(formatted).toBe(output.trim())
        }
    }
    const intact = (input: string) => {
        return test(input.trim(), input.trim())
    }

    it('1', test(`fun    foo(param:    Int)   ;`, `fun foo(param: Int);`));
    it('2', intact(`fun foo(/* leading comment */ param: Int);`));
    it('3', intact(`fun foo(/* leading comment */ /* second */ param: Int);`));
    it('4', intact(`fun foo(param: Int /* trailing comment */);`));
    it('5', intact(`fun foo(/* leading comment */ param: Int /* trailing comment */);`));

    it('2', intact(`
fun foo(
    param: Int,
);`));

    it('2', test(`
fun foo(
    param: Int
);`, `
fun foo(
    param: Int,
);`));

    it('complex', test(`
fun some(// top comment
/* oopsy */param:Int/* hello there *//* wtf bro */,// comment here
// bottom comment
/* oh no */loh: Bool);`, `
fun some(
    // top comment
    /* oopsy */param: Int /* hello there */ /* wtf bro */, // comment here
    // bottom comment
    /* oh no */ loh: Bool,
);`));


    it('5', intact(`
fun foo() {
    Foo { name: "" };
}`));

    it('5', intact(`
fun foo() {
    Foo { name: "" /* trailing comment */ };
}`));

    it('5', intact(`
fun foo() {
    Foo { /* leading comment */ name: "" };
}`));

    it('5', intact(`
fun foo() {
    Foo { name: "", other: 100 };
}`));

    it('5', test(`
fun foo() {
    Foo { name: "" 
    };
}`, `
fun foo() {
    Foo { name: "" };
}`));

    it('5', test(`
fun foo() {
    Foo { name: 
    "" };
}`, `
fun foo() {
    Foo { name: "" };
}`));

    it('5', test(`
fun foo() {
    Foo { 
    name
    : 
    "" };
}`, `
fun foo() {
    Foo {
        name: "",
    };
}`));

    it('5', test(`
fun foo() {
    Foo { 
    name: ""  };
}`, `
fun foo() {
    Foo {
        name: "",
    };
}`));

    it('5', intact(`fun foo() {
    let foo/*: Foo*/ = 1;
}`));

    it('5', intact(`fun foo() {
    let foo: Foo /*: Foo*/ = 1;
}`));

    it('5', intact(`fun foo() {
    let foo/*: Foo*/: Foo = 1;
}`));

    it('5', intact(`fun foo() {
    let foo: Foo = /*: Foo*/1;
}`));

    it('5', intact(`fun foo() {
    let foo: Foo = 1/*: Foo*/;
}`));

// TODO: fix
//
//     it('5', intact(`fun foo() {
//     let foo/*
//         oopsy
//     */ = 1;
// }`));

    it('5', intact(`fun some() {
    if (a > 10) {
        return 1;
    } else if (a < 200) {
        return 2;
    } else {
        return 3;
    }
}`));

    it('5', intact(`fun some() {
    if /* comment */(a > 10) {
        return 1;
    }
}`));

//     it('5', intact(`fun some() {
//     if (a > 10)/* comment */ {
//         return 1;
//     }
// }`));

    it('5', test(`
contract Foo(
param: Int,
 
 some: Cell) with Bar,
  Foo {}
`,
        `
contract Foo(
    param: Int,
    some: Cell,
) with 
    Bar,
    Foo,
{
}`));

    it('5', intact(`
@interface("some.api.interface")
contract Foo(param: Int) with Bar, Foo {
    field: Int = 100;

    const FOO: Int = 100;

    init(field: Int) {}

    receive() {}

    external(slice: Slice) {}

    get fun foo(p: String) {}
}`));

    it('5', intact(`
trait Foo with Bar, Foo {
    field: Int = 100;

    const FOO: Int = 100;

    receive() {}

    external(slice: Slice) {}

    get fun foo(p: String) {}
}`));

    describe('structs and messages', () => {
        it('simple struct', intact(`
struct Foo {
    name: String;
}`));

        it('struct with multiple fields', intact(`
struct Foo {
    name: String;
    age: Int;
    isActive: Bool;
}`));

        it('struct with field initialization', intact(`
struct Foo {
    name: String = "default";
    count: Int = 0;
}`));

        it('format struct with extra spaces', test(`
struct    Foo    {
    name:    String    ;
    age:    Int    ;
}`, `
struct Foo {
    name: String;
    age: Int;
}`));

        it('format struct with newlines', test(`
struct Foo {
    name: String;

    age: Int;
}`, `
struct Foo {
    name: String;
    age: Int;
}`));


        it('simple message', intact(`
message Foo {
    name: String;
}`));

        it('message with opcode', intact(`
message(0x123) Foo {
    name: String;
}`));

        it('message with complex opcode', intact(`
message(1 + 2) Foo {
    name: String;
}`));

        it('message with multiple fields', intact(`
message Foo {
    name: String;
    age: Int;
    isActive: Bool;
}`));

        it('message with field initialization', intact(`
message Foo {
    name: String = "default";
    count: Int = 0;
}`));

        it('format message with extra spaces', test(`
message    Foo    {
    name:    String     ;
    age:    Int    ;
}`, `
message Foo {
    name: String;
    age: Int;
}`));

        it('format message with newlines', test(`
message Foo {
    name: String;

    age: Int;
}`, `
message Foo {
    name: String;
    age: Int;
}`));
    });
});
