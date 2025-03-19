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

    describe('types', () => {
        it('simple type', intact(`
fun foo(param: String) {}`));

        it('generic type', intact(`
fun foo(param: map<Int, String>) {}`));

        it('optional type', intact(`
fun foo(param: String?) {}`));

        it('type with as', intact(`
fun foo(param: Int as int64) {}`));

        it('complex type', intact(`
fun foo(param: map<Int as int64, String>) {}`));

        it('format type with extra spaces', test(`
fun foo(param:    String    ) {}`, `
fun foo(param: String) {}`));

        it('format generic type with extra spaces', test(`
fun foo(param:    map    <    Int    ,    String    >    ) {}`, `
fun foo(param: map<Int, String>) {}`));

        it('format optional type with extra spaces', test(`
fun foo(param:    String    ?    ) {}`, `
fun foo(param: String?) {}`));

        it('format type with as and extra spaces', test(`
fun foo(param:    String    as    Int    ) {}`, `
fun foo(param: String as Int) {}`));
    });

    describe('destruct statement', () => {
        it('simple destruct', intact(`
fun foo() {
    let Foo { name } = value;
}`));

        it('destruct with field mapping', intact(`
fun foo() {
    let Foo { name: myName } = value;
}`));

        it('destruct with multiple fields', intact(`
fun foo() {
    let Foo { name, age: myAge } = value;
}`));

        it('destruct with rest argument', intact(`
fun foo() {
    let Foo { name, .. } = value;
}`));

        it('destruct with rest argument and fields', intact(`
fun foo() {
    let Foo { name, age, .. } = value;
}`));

        it('format destruct with extra spaces', test(`
fun foo() {
    let    Foo    {    name    ,    age    }    =    value;
}`, `
fun foo() {
    let Foo { name, age } = value;
}`));
    });

    describe('repeat statement', () => {
        it('simple repeat', intact(`
fun foo() {
    repeat (condition) {
        body;
    }
}`));

        it('repeat with complex condition', intact(`
fun foo() {
    repeat (a > 10 && b < 20) {
        body;
    }
}`));

        it('format repeat with extra spaces', test(`
fun foo() {
    repeat    (    condition    )    {
        body;
    }
}`, `
fun foo() {
    repeat (condition) {
        body;
    }
}`));
    });

    describe('until statement', () => {
        it('simple until', intact(`
fun foo() {
    do {
        body;
    } until (condition);
}`));

        it('until with complex condition', intact(`
fun foo() {
    do {
        body;
    } until (a);
}`));

        it('format until with extra spaces', test(`
fun foo() {
    do    {
        body;
    }    until    (    true    )    ;
}`, `
fun foo() {
    do {
        body;
    } until (true);
}`));
    });

    describe('try statement', () => {
        it('simple try', intact(`
fun foo() {
    try {
        body;
    }
}`));

        it('try with catch', intact(`
fun foo() {
    try {
        body;
    } catch (error) {
        handle;
    }
}`));

        it('format try with extra spaces', test(`
fun foo() {
    try    {
        body;
    }    catch    (    error    )    {
        handle;
    }
}`, `
fun foo() {
    try {
        body;
    } catch (error) {
        handle;
    }
}`));
    });

    describe('forEach statement', () => {
        it('simple forEach', intact(`
fun foo() {
    foreach (key, value in items) {
        body;
    }
}`));

        it('forEach with complex expression', intact(`
fun foo() {
    foreach (key, value in map.items()) {
        body;
    }
}`));

        it('format forEach with extra spaces', test(`
fun foo() {
    foreach    (    key    ,    value    in    items    )    {
        body;
    }
}`, `
fun foo() {
    foreach (key, value in items) {
        body;
    }
}`));
    });
});
