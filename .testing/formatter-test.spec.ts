import {format} from "./formatter/formatter";
import {parseCode} from "./cst-helpers";

function normalizeIndentation(input: string): string {
    const lines = input.split('\n');
    if (lines.length <= 1) return input;

    const indents = lines.slice(1, -1)
        .filter(line => line.trim().length > 0)
        .map(line => line.match(/^\s*/)[0].length)
    const minIndent = Math.min(...indents);

    if (minIndent === 0) {
        return input;
    }

    return lines.map((line, index) => {
        if (index === 0) return line;
        if (minIndent > line.length) {
            return line.trimStart();
        }
        return line.slice(minIndent);
    }).join('\n');
}

describe('should format', () => {
    const test = (input: string, output: string) => {
        return () => {
            const normalizedInput = normalizeIndentation(input).trim();
            const normalizedOutput = normalizeIndentation(output).trim();
            const root = parseCode(normalizedInput);
            if (root === undefined) {
                fail("cannot parse code")
            }

            const formatted = format(root)
            expect(formatted.trim()).toBe(normalizedOutput)
        }
    }
    const intact = (input: string) => {
        return test(input, input)
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

    it('5', intact(`
        fun foo() {
            let foo /*: Foo*/ = 1;
        }
    `));

    it('5', intact(`
        fun foo() {
            let foo: Foo /*: Foo*/ = 1;
        }
    `));

    it('5', intact(`
        fun foo() {
            let foo /*: Foo*/: Foo = 1;
        }
    `));

    it('5', intact(`
        fun foo() {
            let foo: Foo = /*: Foo*/1;
        }
    `));

    it('5', intact(`
        fun foo() {
            let foo: Foo = 1/*: Foo*/;
        }
    `));

// TODO: fix
//
//     it('5', intact(`fun foo() {
//     let foo/*
//         oopsy
//     */ = 1;
// }`));

    it('5', intact(`
        fun some() {
            if (a > 10) {
                return 1;
            } else if (a < 200) {
                return 2;
            } else {
                return 3;
            }
        }
    `));

    it('5', intact(`
        fun some() {
            if /* comment */(a > 10) {
                return 1;
            }
        }
    `));

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
{}`));

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

        it('format struct with newlines', intact(`
struct Foo {
    name: String;

    age: Int;
}`));

        it('struct without fields', intact(`
            struct Foo {}
        `));

        it('struct without fields but with comment', intact(`
            struct Foo {
                // empty on purpose
            }
        `));

        it('struct without fields but with comments', intact(`
            struct Foo {
                // empty on purpose
                // don't remove
                // this comment
            }
        `));

        // TODO
        // it('struct with trailing comment', intact(`
        //     struct Foo {
        //         foo: Int;
        //         // comment
        //     }
        // `));
        //
        // it('struct with trailing comment 2', intact(`
        //     struct Foo {
        //         foo: Int; // comment here
        //         // comment
        //     }
        // `));

        it('struct with inline comment for field', intact(`
            struct Foo {
                foo: Int; // comment
            }
        `));

        it('struct with inline comment for field and field after', intact(`
            struct Foo {
                foo: Int; // comment
                field: String;
            }
        `));

        it('struct with inline comment for field and field after with comment', intact(`
            struct Foo {
                foo: Int; // comment
                // comment here
                field: String;
            }
        `));

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

        it('format message with newlines', intact(`
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

    describe('expressions', () => {
        describe('literals', () => {
            it('string literal', intact(`
fun foo() {
    let x = "hello";
}`));

            it('integer literal', intact(`
fun foo() {
    let x = 123;
}`));

            it('boolean literal', intact(`
fun foo() {
    let x = true;
}`));

            it('null literal', intact(`
fun foo() {
    let x = null;
}`));
        });

        describe('binary operations', () => {
            it('arithmetic operations', intact(`
fun foo() {
    let x = a + b * c / d % e;
}`));

            it('comparison operations', intact(`
fun foo() {
    let x = a < b <= c > d >= e;
}`));

            it('equality operations', intact(`
fun foo() {
    let x = a == b != c;
}`));

            it('bitwise operations', intact(`
fun foo() {
    let x = a & b ^ c | d << e >> f;
}`));

            it('logical operations', intact(`
fun foo() {
    let x = a && b || c;
}`));
        });

        describe('unary operations', () => {
            it('simple unary', intact(`
fun foo() {
    let x = -a;
}`));

            it('multiple unary', intact(`
fun foo() {
    let x = !~-a;
}`));
        });

        describe('conditional expressions', () => {
            it('simple conditional', intact(`
fun foo() {
    let x = a ? b : c;
}`));

            it('nested conditional', intact(`
fun foo() {
    let x = a
        ? b
        : c ? d : e;
}`));

            it('complex conditional', intact(`
fun foo() {
    let x = a > 10 ? b + c : d;
}`));

            it('nexted conditional', intact(`
fun foo() {
    let x = a > 10 ? (b ? c : d) : d;
}`));

            it('long conditional', intact(`
                fun foo() {
                    let targetJettonWallet: BasechainAddress = (ownerWorkchain == Workchain)
                        ? contractBasechainAddress(initOf JettonWallet(0, msg.ownerAddress, myAddress()))
                        : emptyBasechainAddress();
                }
            `));
        });

        describe('suffix operations', () => {
            it('field access', intact(`
fun foo() {
    let x = obj.field;
}`));

            it('method call', intact(`
fun foo() {
    let x = obj.method();
}`));

            // TODO
            // it('chained operations', intact(`
            // fun foo() {
            //     let x = obj.method().field.anotherMethod();
            // }`));

            it('unbox not null', intact(`
fun foo() {
    let x = obj!!;
}`));
        });

        describe('chains', () => {
            it('simple field chain', intact(`
                fun foo() {
                    a.foo;
                }
            `));

            it('simple call chain', intact(`
                fun foo() {
                    a();
                }
            `));

            it('simple method call chain', intact(`
                fun foo() {
                    f.a();
                }
            `));

            it('method call chain with field', intact(`
                fun foo() {
                    f.foo.a();
                }
            `));

             it('method call chain with calls', intact(`
                fun foo() {
                    sender().asSlice();
                }
            `));

            it('method call chain with field and newline', test(`
                fun foo() {
                    f.foo
                    .a();
                }
            `, `
                fun foo() {
                    f
                        .foo
                        .a();
                }
            `));

            it('nested chain with field and newline', test(`
                fun foo() {
                    foo.bar;
                    foo().bar.baz(foo
                    .bar(
                    1, 2, 3))
                    .boo.beee.aaaa;
                }
            `, `
                fun foo() {
                    foo.bar;
                    foo()
                        .bar
                        .baz(foo.bar(
                            1,
                            2,
                            3,
                        ))
                        .boo
                        .beee
                        .aaaa;
                }
            `));

            it('method chain with comment', intact(`
                fun foo() {
                    a
                        .bar() // comment 1
                        .foo(); /*comment*/
                }
            `));

            it('field chain with comment', intact(`
                fun foo() {
                    a.foo /*comment*/;
                }
            `));

            it('field chain with comment 2', intact(`
                fun foo() {
                    a.foo /*comment*/.bar /*comment 2*/;
                }
            `));

            it('field chain with comment 2', test(`
                fun foo() {
                    a.foo // comment
                    .bar // comment 2
                    ;
                }
            `, `
                fun foo() {
                    a
                        .foo // comment
                        .bar // comment 2;
                }
            `));

            it('field chain in struct instance', test(`
                fun foo() {
                    return Foo {
                        foo: bar.baz
                    }
                }
            `, `
                fun foo() {
                    return Foo {
                        foo: bar.baz,
                    };
                }
            `));
        });

        describe('special expressions', () => {
            it('initOf', intact(`
fun foo() {
    let x = initOf Foo(a, b);
}`));

            it('codeOf', intact(`
fun foo() {
    let x = codeOf Foo;
}`));

            it('struct instance', intact(`
fun foo() {
    let x = Foo { name: "test", value: 123 };
}`));

            it('empty struct instance', intact(`
                fun foo() {
                    Foo {};
                }
            `));
        });

        describe('format expressions with extra spaces', () => {
            it('binary operation', test(`
fun foo() {
    let x =    a    +    b    ;
}`, `
fun foo() {
    let x = a + b;
}`));

            it('conditional', test(`
fun foo() {
    let x =    a    ?    b    :    c    ;
}`, `
fun foo() {
    let x = a ? b : c;
}`));

            it('nested conditional', intact(`
                fun foo() {
                    return (a == 1)
                        ? 42
                        : (a == 2)
                            ? 43
                            : (a == 3) ? 44 : 45;
                }
            `));

//             it('method call', test(`
// fun foo() {
//     let x =    obj    .    method    (    )    ;
// }`, `
// fun foo() {
//     let x = obj.method();
// }`));
        });
    });

    describe('imports', () => {
        it('simple import', intact(`
import "stdlib";

fun foo() {}`));

        it('import with extra spaces', test(`
import    "stdlib"    ;
fun foo() {}`, `
import "stdlib";

fun foo() {}`));

        it('multiple imports', intact(`
import "stdlib";
import "stdlib2";

fun foo() {}`));

        it('imports with complex paths', intact(`
import "stdlib/contracts";
import "custom/path/to/module";

fun foo() {}`));

        it('imports with newlines', test(`
import 
"stdlib"
; fun foo() {}`, `
import "stdlib";

fun foo() {}`));

        it('single import with function with comment', intact(`
            import "";
            
            // comment here
            fun foo() {}
        `));
    });

    describe('statement comments', () => {
        it('inline comment after let statement', intact(`
            fun foo() {
                let a = 10; // comment
            }
        `));

        it('inline comment after destruct statement', intact(`
            fun foo() {
                let Foo { a } = 10; // comment
            }
        `));

        // TODO
        // it('inline comment after a block statement', intact(`
        //     fun foo() {
        //         {
        //            10;
        //         } // comment
        //     }
        // `));

        it('inline comment after return statement', intact(`
            fun foo() {
                return 10; // comment
            }
        `));

        it('inline comment after return statement 2', intact(`
            fun foo() {
                return; // comment
            }
        `));

        it('inline comment after if statement', intact(`
            fun foo() {
                if (true) {} // comment
            }
        `));

        it('inline comment after if statement with else', intact(`
            fun foo() {
                if (true) {} else {} // comment
            }
        `));

        it('inline comment after if statement with else if', intact(`
            fun foo() {
                if (true) {} else if (false) {} // comment
            }
        `));

        it('inline comment after if statement with else if and else', intact(`
            fun foo() {
                if (true) {} else if (false) {} else {} // comment
            }
        `));

        it('inline comment after while statement', intact(`
            fun foo() {
                while (true) {} // comment
            }
        `));

        it('inline comment after repeat statement', intact(`
            fun foo() {
                repeat (10) {} // comment
            }
        `));

        it('inline comment after until statement', intact(`
            fun foo() {
                do {} until (true); // comment
            }
        `));

        it('inline comment after try statement', intact(`
            fun foo() {
                try {} // comment
            }
        `));

        it('inline comment after try statement with catch', intact(`
            fun foo() {
                try {} catch (e) {} // comment
            }
        `));

        it('inline comment after foreach statement', intact(`
            fun foo() {
                foreach (a, b in foo) {} // comment
            }
        `));

        it('inline comment after expression statement', intact(`
            fun foo() {
                10; // comment
            }
        `));

        it('inline comment after assign statement', intact(`
            fun foo() {
                a = 10; // comment
            }
        `));

        it('top comment for first statement', intact(`
            fun foo() {
                // top comment
                let a = 10;
            }
        `));

        it('top comment for second statement', intact(`
            fun foo() {
                let a = 10;
                // top comment
                a = 200;
            }
        `));

        it('top comment for second statement with newline between', intact(`
            fun foo() {
                let a = 10;

                // top comment
                a = 200;
            }
        `));

        it('block with single comment', intact(`
            fun foo() {
                // top comment
            }
        `));

        it('block with trailing comment', intact(`
            fun foo() {
                let a = 100;
                // top comment
            }
        `));

        it('block with comments everywhere', intact(`
            fun foo() {
                // top comment
                let a = 100; /* inline comment */// wtf bro
                a = 20; // hehe
                if (a == 20) {
                    // top comment 2
                    a = 1000; // inline comment
                    /* another trailing comment */
                } else if (a == 30) {
                    // top comment 2
                    a = 2000; // inline comment
                    /* another trailing comment */
                } else {
                    // top comment 2
                    a = 4000; // inline comment
                    /* another trailing comment */
                }
                // trailing comment
            }
        `));

        it('block with comments, statements and newlines', intact(`
            fun foo() {
                // top comment
                let a = 100;
                a = 20;

                // some comment
                let b = 1000;

                b = 200;

                while (true) {
                    // comment
                    b = 4000;
                }
            }
        `));

        it('block with different statements with top and inline comments', intact(`
            fun foo() {
                do {} until (true); // comment 1

                try {} catch (e) {} // comment
                try {} // comment
                foreach (a, b in foo) {} // comment
                while (true) {} // comment

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
        `));

        it('block with leading newlines', test(`
            fun foo() {

                let a = 100;
                a = 20;
            }
        `, `
            fun foo() {
                let a = 100;
                a = 20;
            }
        `));

        it('block with trailing newlines', test(`
            fun foo() {
                let a = 100;
                a = 20;

            }
        `, `
            fun foo() {
                let a = 100;
                a = 20;
            }
        `));

        it('preserve newlines after if', intact(`
            fun foo() {
                if (true) {
                    return 200;
                }

                return 100;
            }
        `));

        it('preserve newlines after if-else', intact(`
            fun foo() {
                if (true) {
                    return 200;
                } else {
                    return 200;
                }

                return 100;
            }
        `));

        it('preserve newlines after if-else-if', intact(`
            fun foo() {
                if (true) {
                    return 200;
                } else if (false) {
                    return 200;
                }

                return 100;
            }
        `));

        it('preserve newlines after if-else-if-else', intact(`
            fun foo() {
                if (true) {
                    return 200;
                } else if (false) {
                    return 200;
                } else {
                    return 200;
                }

                return 100;
            }
        `));

        it('preserve newlines after while', intact(`
            fun foo() {
                while (true) {}

                return 100;
            }
        `));
    });

    describe('top level comments', () => {
        it('comment for import', intact(`
            // top comment
            import "";
        `));

        it('inline comment for import', intact(`
            import ""; // inline comment
            import "";
        `));

        it('comments for import', intact(`
            // top comment
            // top comment line 2
            import "";
        `));

        it('comments for several imports', intact(`
            // top comment
            import "";
            // top comment
            import "";
        `));

        it('comments for several imports and declaration after', intact(`
            // top comment
            import "";
            // top comment
            import "";
            
            // comment here
            fun foo() {}
        `));

        it('comments for several imports and declaration after 2', intact(`
            // top comment
            import "";
            // top comment
            import ""; // inline comment
            
            // comment here
            fun foo() {}
        `));

        it('top level comment for function', intact(`
            // top comment
            fun foo() {}
        `));

        it('top level comment for constant', intact(`
            // top comment
            const FOO: Int = 100;
        `));

        it('top level comment for functions', intact(`
            // top comment
            fun foo() {}
            
            // other top comment
            fun bar() {}
        `));

        it('top and inline level comment for functions', intact(`
            // top comment
            fun foo() {} // inline comment
            
            // other top comment
            fun bar() {} // inline comment 2
            
            fun baz() {}
        `));

        // TODO
        // it('floating comments between declarations', intact(`
        //     fun foo() {}
        //
        //     // floating comment
        //
        //     fun bar() {}
        // `));

        // TODO
        // it('top level comment for function with empty line between comments', intact(`
        //     // comment here
        //
        //     // top comment
        //     fun foo() {}
        // `));
    });

    describe('top level declarations', () => {
        it('empty struct', intact(`
            struct Foo {}
        `));

        it('struct with field', intact(`
            struct Foo {
                value: Int;
            }
        `));

        it('struct with field and inline comment', intact(`
            struct Foo {
                value: Int; // inline comment
            }
        `));

        it('struct with field, top and inline comment', intact(`
            struct Foo {
                // top comment
                value: Int; // inline comment
            }
        `));

        it('struct with fields', intact(`
            struct Foo {
                // top comment
                value: Int; // inline comment
                some: Int;
            }
        `));

        it('struct with fields 2', intact(`
            struct Foo {
                // top comment
                value: Int; // inline comment
                // top comment 2
                some: Int;
            }
        `));

        it('struct with fields 3', intact(`
            struct Foo {
                // top comment
                value: Int;
                some: Int;
            }
        `));

        it('struct with fields 2', intact(`
            struct Foo {
                // top comment
                value: Int; // inline comment

                // top comment 2
                some: Int;
            }
        `));



        it('empty contract', intact(`
            contract Foo {}
        `));

        it('empty contract with comment', intact(`
            contract Foo {
                // empty contract
            }
        `));

        it('contract with parameters', intact(`
            contract Foo(value: Int) {}
        `));

        it('contract with parameters on new lines', intact(`
            contract Foo(
                value: Int,
            ) {}
        `));

        it('contract with single field', intact(`
            contract Foo {
                foo: Int;
            }
        `));

        it('contract with single field and trailing newlines', test(`
            contract Foo {
                foo: Int;
                
                
            }
        `, `
            contract Foo {
                foo: Int;
            }
        `));

        it('contract with two fields', intact(`
            contract Foo {
                foo: Int;
                bar: Int;
            }
        `));

        it('contract with two fields and newline between', intact(`
            contract Foo {
                foo: Int;

                bar: Int;
            }
        `));

        it('contract with two fields and several newlines between', test(`
            contract Foo {
                foo: Int;



                bar: Int;
            }
        `, `
            contract Foo {
                foo: Int;

                bar: Int;
            }
        `));

        it('contract with two fields, several newlines between and trailing newline', test(`
            contract Foo {
                foo: Int;



                bar: Int;


            }
        `, `
            contract Foo {
                foo: Int;

                bar: Int;
            }
        `));

        it('contract with two fields and constant', intact(`
            contract Foo {
                foo: Int;
                bar: Int;
                const Foo: Int = 0;
            }
        `));

        it('contract with two fields and function', intact(`
            contract Foo {
                foo: Int;
                bar: Int;
                fun foo() {}
            }
        `));

        it('contract with receive with empty line after', intact(`
            contract Test {
                init() {}
                receive(src: A) {}
            
                bounced(src: Int) {}
            }
        `));

        it('contract with fun with empty line after', intact(`
            contract Test {
                init() {}
                fun foo() {}
            
                bounced(src: Int) {}
            }
        `));

        it('contract with init with empty line after', intact(`
            contract Test {
                init() {}
            
                bounced(src: Int) {}
            }
        `));

        it('contract with const with empty line after', intact(`
            contract Test {
                const FOO: Int = 100;
            
                bounced(src: Int) {}
            }
        `));

        it('contract with field with empty line after', intact(`
            contract Test {
                foo: Int;
            
                bounced(src: Int) {}
            }
        `));

        it('contract with various comments', intact(`
            contract Foo {
                init() {} // inline comment

                /*************/
                /*           */
                /*************/

                /// Comment
                fun foo() {}

                // trailing comment
            }
        `));

        it('trait with abstract constant', intact(`
            trait T {
                abstract const Foo: Int;
            }
        `));

        it('preserve newlines for constants', intact(`
            const FOO: Int = 100;
            const BAR: Int = 100;
            const BAZ: Int = 100;
        `));

        it('one line function', intact(`
            fun foo() { return 10 }
        `));

        it('one line function with if', test(`
            fun foo() { if (true) {
                return 10;
            } }
        `, `
            fun foo() {
                if (true) {
                    return 10;
                }
            }
        `));

        it('function with oneline body', intact(`
            fun foo() {
                if (true) { return }
            }
        `));

        it('native function', intact(`
            @name("some")
            native foo();
        `));

        it('native function with trailing comment', intact(`
            @name("some")
            native foo(); // trailing comment
            
            fun foo() {}
        `));

        it('native function with comment after attribute', intact(`
            @name("some") // func func
            native foo();
        `));

        it('native function with block comment after attribute', test(`
            @name("some") /* func func */ native foo();
        `, `
            @name("some") /* func func */
            native foo();
        `));

        it('asm function with trailing comment', intact(`
            asm fun foo() { ONE } // comment
            fun foo() {}
        `));

        it('function declaration with trailing comment', intact(`
            fun foo(); // comment
        `));

        it('constant with trailing comments', intact(`
            const FOO: Int = 100; // comment 1
            const BAR: Int = 100;
        `));

        it('constant with comments before `;` and with trailing comments', intact(`
            const FOO: Int = 100 /*comment 2*/; // comment 1
            const BAR: Int = 100;
        `));

        it('constant without value with trailing comments', intact(`
            const FOO: Int; // comment 1
            const BAR: Int = 100;
        `));

        it('constant with value with trailing comments inside trait', intact(`
            trait Foo {
                const FOO: Int = 100; // comment 1
            }
        `));

        it('constant without value with trailing comments inside trait', intact(`
            trait Foo {
                abstract const FOO: Int; // comment 1
            }
        `));
    })

    describe('types', () => {
        it('bounced type', intact(`
            fun foo(f: bounced<Foo>) {}
        `));
    })
});
