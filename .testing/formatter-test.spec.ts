import {Builder, createContext, CstNode, Module, space} from "./result";
import {format} from "./formatter/formatter";

describe('should format', () => {
    const test = (input: string, output: string) => {
        return () => {
            const ctx = createContext(input.trim(), space);
            const b: Builder = []
            const res = Module(ctx, b)
            expect(res).toBe(true);
            const root = CstNode(b, "Root");

            const target = ((root.children[0] as CstNode).children[0] as CstNode).children[0];
            const formatted = format(target)
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
});
