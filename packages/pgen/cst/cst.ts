import * as t from '@babel/types';
import * as g from './transform';
import {expressionStatement} from "@babel/types";

export const generate = (node: g.Grammar): t.File => {
    return t.file(t.program(
        node.rules.map((it) => generateRule(it))
    ))
}

export const generateRule = (node: g.Rule): t.ExportNamedDeclaration => {
    const name = t.identifier(node.name);

    if (node.formals.length > 0) {
        name.typeAnnotation = t.tsTypeAnnotation(t.tsFunctionType(
            undefined,
            node.formals.map(it => {
                const ident = t.identifier(it);
                ident.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Rule")))
                return ident
            }),
            t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Rule")))
        ))
    } else {
        name.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Rule")))
    }

    const arrowFunction = t.arrowFunctionExpression(
        [
            t.identifier("ctx"),
            t.identifier("b"),
            t.identifier("field"),
        ],
        t.blockStatement(generateExpr(node.body, node.isPrivate ? "" : node.name, undefined))
    );

    // export const commaList: (T: Rule) => Rule = (T: Rule) => {
    //     return (ctx, b) => { ... }
    // }
    if (node.formals.length > 0) {
        return t.exportNamedDeclaration(t.variableDeclaration(
            'const',
            [
                t.variableDeclarator(
                    name,
                    t.arrowFunctionExpression(
                        node.formals.map(it => t.identifier(it)),
                        t.blockStatement(
                            [
                                t.returnStatement(
                                    arrowFunction
                                )
                            ]
                        )
                    ),
                )
            ]
        ))
    }

    return t.exportNamedDeclaration(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                name,
                arrowFunction,
            )
        ]
    ))
}

export const generateExpr = (node: g.Expr, ruleName: string, fieldName: undefined | string): t.Statement[] => {
    switch (node.$) {
        case 'Seq':
            return generateSeq(node, ruleName)
        case 'Alt':
            return generateAlt(node, ruleName)
        case 'Star':
            return generateStar(node, ruleName)
        case 'Plus':
            return generatePlus(node, ruleName)
        case 'Terminal':
            return generateSeq(g.Seq([g.SeqClause(node, undefined)]), ruleName)
        case 'Class':
            return generateClass(node)
        case 'Stringify':
            return generateStringify(node)
        case 'Lex':
            return generateLex(node, ruleName)
        case 'Optional':
            return generateOptional(node, ruleName)
        case "Any":
            return generateAny()
        case "Call":
            return generateCall(node, ruleName, fieldName)
        case "LookNeg":
            return generateLookNeg(node)
        case "LookPos":
            return generateLookPos(node)
    }
}

// const b: Builder = []
const createEmptyBuilder = (builderName: string) => {
    const ident = t.identifier(builderName)
    ident.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Builder")))
    return t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                ident,
                t.arrayExpression([])
            )
        ]
    );
};

// const p = ctx.p
const saveCurrentPosition = () => t.variableDeclaration(
    'const',
    [
        t.variableDeclarator(t.identifier("p"), t.memberExpression(t.identifier("ctx"), t.identifier("p")))
    ]
);

// b.push(CstNode(b2))
const storeNodeFromBuilder = (name: string, nodeType: string) => t.expressionStatement(
    t.callExpression(
        t.memberExpression(
            t.identifier("b"),
            t.identifier("push")
        ), [
            t.callExpression(t.identifier("CstNode"), [
                t.identifier(name),
                ...(nodeType.length > 0 && !isLowerCase(nodeType[0])
                    ? [t.stringLiteral(nodeType)]
                    : [t.logicalExpression("??", t.identifier("field"), t.stringLiteral(""))]),
                t.logicalExpression("??", t.identifier("field"), t.stringLiteral(""))
            ])
        ])
);

// b.push(CstLeaf(expr))
const storeLeaf = (expr: t.Expression) => t.expressionStatement(
    t.callExpression(
        t.memberExpression(
            t.identifier("b"),
            t.identifier("push")
        ), [
            t.callExpression(t.identifier("CstLeaf"), [expr])
        ])
);

// if (r && b2.length > 0) {
//    b.push(CstNode(b2))
// }
const storeNodeIfMatched = (nodeType: string) => t.ifStatement(
    t.logicalExpression(
        "&&",
        t.identifier("r"),
        t.binaryExpression(
            '>',
            t.memberExpression(t.identifier("b2"), t.identifier("length")),
            t.numericLiteral(0)
        )
    ),
    t.blockStatement([
        storeNodeFromBuilder("b2", nodeType)
    ]),
);

// if (b2.length > 0) {
//    b.push(CstNode(b2))
// }
const storeNodeIfNotEmpty = (nodeType: string) => t.ifStatement(
    t.binaryExpression(
        '>',
        t.memberExpression(t.identifier("b2"), t.identifier("length")),
        t.numericLiteral(0)
    ),
    t.blockStatement([
        storeNodeFromBuilder("b2", nodeType)
    ]),
);

// const A = (ctx: Context, b: Builder): boolean => {
//     const p = ctx.p
//     const r = B(ctx, [])
//     ctx.p = p
//     return r
// }
export const generateLookPos = (lookNeg: g.LookPos): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const p = ctx.p
    stmts.push(saveCurrentPosition())

    // const r = B(ctx, b)
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(lookNeg.expr, undefined, t.arrayExpression([])))
        ]
    ))

    // ctx.p = p
    stmts.push(t.expressionStatement(t.assignmentExpression(
        '=',
        t.memberExpression(t.identifier("ctx"), t.identifier("p")),
        t.identifier("p")
    )))

    // return r
    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

// const A = (ctx: Context, b: Builder): boolean => {
//     const p = ctx.p
//     const r = B(ctx, b)
//     ctx.p = p
//     return !r
// }
export const generateLookNeg = (lookNeg: g.LookNeg): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const p = ctx.p
    stmts.push(saveCurrentPosition())

    // const r = B(ctx, b)
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(lookNeg.expr, undefined, t.identifier("b")))
        ]
    ))

    // ctx.p = p
    stmts.push(t.expressionStatement(t.assignmentExpression(
        '=',
        t.memberExpression(t.identifier("ctx"), t.identifier("p")),
        t.identifier("p")
    )))

    // return !r
    stmts.push(t.returnStatement(t.unaryExpression("!", t.identifier("r"))))
    return stmts
}

export const compileCall = (call: g.Call): t.Expression => {
    if (call.params.length > 0) {
        // commaList(Foo)(args)
        const params = call.params.map(param => {
            if (param.$ === "Call") {
                return compileCall(param)
            }
            if (param.$ === "Terminal") {
                // (ctx, b) => consumeToken(ctx, b, <param>)
                return t.arrowFunctionExpression(
                    [
                        t.identifier("ctx"),
                        t.identifier("b"),
                    ],
                    compileTerminal(param, t.identifier("b"))
                )
            }
            if (param.$ === "Class") {
                // (ctx, b) => consumeClass(ctx, b, <param>)
                return t.arrowFunctionExpression(
                    [
                        t.identifier("ctx"),
                        t.identifier("b"),
                    ],
                    compileClass(param, t.identifier("b"))
                )
            }
            if (param.$ === "Any") {
                return t.arrowFunctionExpression(
                    [
                        t.identifier("ctx"),
                        t.identifier("b"),
                    ],
                    compileAny(t.identifier("b"))
                )
            }
            throw new Error(`Unsupported param ${param.$}`)
        })

        return emitCall(call.name, params)
    }

    return t.identifier(call.name)
}

// export const FunctionDefinition: Rule = (ctx, b, field) => {
//     const b2: Builder = [];
//     const r = statements(ctx, b2);
//     if (r) {
//         b.push(CstNode(b2, ruleName, field ?? ""));
//     }
//     return r;
// };
export const generateCall = (call: g.Call, ruleName: string, fieldName: undefined | string): t.Statement[] => {
    const stmts: t.Statement[] = []

    if (ruleName.length > 0 && (isLowerCase(ruleName[0]) || ruleName[0] === "$")) {
        const stmts: t.Statement[] = []

        const expr = compileCall(call)

        // return B(ctx, b)
        stmts.push(t.returnStatement(
            t.callExpression(
                expr,
                [
                    t.identifier("ctx"),
                    t.identifier("b"),
                    t.identifier("field"),
                ]
            )
        ))

        return stmts
    }

    // const b2: Builder = []
    stmts.push(createEmptyBuilder("b2"))

    const expr = compileCall(call)

    const callExpr = t.callExpression(
        expr,
        [
            t.identifier("ctx"),
            t.identifier("b2"),
            ...(fieldName ? [t.stringLiteral(fieldName)] : []),
        ]
    )

    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), callExpr)
        ]
    ))

    stmts.push(t.ifStatement(
        t.logicalExpression(
            "&&",
            t.identifier("r"),
            t.binaryExpression(
                '>',
                t.memberExpression(t.identifier("b2"), t.identifier("length")),
                t.numericLiteral(0)
            )
        ),
        t.blockStatement([
            t.expressionStatement(t.callExpression(
                t.memberExpression(
                    t.identifier("b"),
                    t.identifier("push")
                ), [
                    t.callExpression(t.identifier("CstNode"), [
                        t.identifier("b2"),
                        t.stringLiteral(ruleName),
                        t.logicalExpression("??", t.identifier("field"), t.stringLiteral(""))
                    ])
                ]))
        ]),
    ))

    // return r
    stmts.push(t.returnStatement(t.identifier("r")))

    return stmts
}

// const A = (ctx: Context, b: Builder): boolean => {
//     if (ctx.p === ctx.l) {
//         b.push(CstLeaf(""))
//         return false
//     }
//
//     const c = ctx.s[ctx.p]
//     b.push(CstLeaf(c))
//     ctx.p++
//     return true
// }
export const generateAny = (): t.Statement[] => {
    const stmts: t.Statement[] = []

    // if (ctx.p === ctx.l) {
    //     b.push(CstLeaf(""))
    //     return false
    // }
    stmts.push(t.ifStatement(
        t.binaryExpression(
            '===',
            t.memberExpression(t.identifier("ctx"), t.identifier("p")),
            t.memberExpression(t.identifier("ctx"), t.identifier("l"))
        ),
        t.blockStatement([
            storeLeaf(t.stringLiteral("")),
            t.returnStatement(t.booleanLiteral(false))
        ])
    ))

    // const c = ctx.s[ctx.p]
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                t.identifier("c"),
                t.memberExpression(
                    t.memberExpression(t.identifier("ctx"), t.identifier("s")),
                    t.memberExpression(t.identifier("ctx"), t.identifier("p")),
                    true,
                )
            )
        ]
    ))

    // b.push(CstLeaf(c))
    stmts.push(storeLeaf(t.identifier("c")))

    // ctx.p++
    stmts.push(t.expressionStatement(t.updateExpression(
        '++',
        t.memberExpression(t.identifier("ctx"), t.identifier("p")),
        false
    )))

    // return true
    stmts.push(t.returnStatement(t.booleanLiteral(true)))
    return stmts
}

// A = B?
//
// const A = (ctx: Context, b: Builder, rule: Rule): boolean => {
//     const b2: Builder = []
//
//     const p = ctx.p
//     let r = B(ctx, b2)
//     r = r || (ctx.p = p, true)
//
//     if (b2.length > 0) {
//         b.push(CstNode(b2))
//     }
//     return r;
// }
export const generateOptional = (node: g.Optional, ruleName: string): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const b2: Builder = []
    stmts.push(createEmptyBuilder("b2"))

    // const p = ctx.p
    stmts.push(saveCurrentPosition())

    // let r = B(ctx, b2);
    stmts.push(t.variableDeclaration(
        'let',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(node.expr, undefined, t.identifier("b2")))
        ]
    ))

    // r = r || (ctx.p = p, true)
    stmts.push(t.expressionStatement(t.assignmentExpression(
        "=",
        t.identifier("r"),
        t.logicalExpression(
            "||",
            t.identifier("r"),
            t.sequenceExpression(
                [
                    t.assignmentExpression(
                        "=",
                        t.memberExpression(t.identifier("ctx"), t.identifier("p")),
                        t.identifier("p")
                    ),
                    t.booleanLiteral(true),
                ]
            )
        )
    )))

    // if (r && b2.length > 0) {
    //    b.push(CstNode(b2))
    // }
    stmts.push(storeNodeIfMatched(ruleName))

    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

// A = #B
// 
// const A = (ctx: Context, b: Builder, rule: Rule): boolean => {
//    const newCtx = {
//        ...ctx,
//        space: undefined,
//    }
//
//    const b2: Builder = []
//    const r = A(newCtx, b2)
//    if (r) { b.push(CstNode(b2)) }
//
//    ctx.p = newCtx.p
//    skip(ctx, b)
//    return r
// }
export const generateLex = (node: g.Lex, ruleName: string): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const b2: Builder = []
    stmts.push(createEmptyBuilder("b2"))

    // const newCtx = {
    //     ...ctx,
    //     space: undefined,
    // }
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                t.identifier("newCtx"),
                t.objectExpression([
                    t.spreadElement(t.identifier("ctx")),
                    t.objectProperty(t.identifier('space'), t.identifier('undefined'))
                ]))
        ]
    ))

    // const r = A(newCtx, b2)
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(node.expr, undefined, t.identifier("b2"), t.identifier("newCtx")))
        ]
    ))

    // if (r) { b.push(CstNode(b2)) }
    stmts.push(t.ifStatement(t.identifier("r"),
        t.blockStatement([
            // b.push(CstNode(b2))
            storeNodeFromBuilder("b2", ruleName)
        ])
    ))

    // ctx.p = newCtx.p
    stmts.push(t.expressionStatement(t.assignmentExpression(
        '=',
        t.memberExpression(t.identifier("ctx"), t.identifier("p")),
        t.memberExpression(t.identifier("newCtx"), t.identifier("p"))
    )))

    // skip(ctx, b)
    stmts.push(t.expressionStatement(t.callExpression(t.identifier("skip"), [t.identifier("ctx"), t.identifier("b")])))

    // return r
    stmts.push(t.returnStatement(t.identifier("r")))

    return stmts
}


// A = $B
// const A = (ctx, b) => {
//     const p = ctx.p
//     const r = B(ctx, []);
//     if (r) {
//         const text = ctx.s.substring(p, ctx.p)
//         b.push(CstLeaf(text))
//     }
//     return r
// }
export const generateStringify = (node: g.Stringify): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const p = ctx.p
    stmts.push(saveCurrentPosition())

    // const r = B(ctx, []);
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(node.expr, undefined, t.arrayExpression([])))
        ]
    ))

    stmts.push(t.ifStatement(t.identifier("r"),
        t.blockStatement([
            // const text = ctx.s.substring(p, ctx.p)
            t.variableDeclaration(
                'const',
                [
                    t.variableDeclarator(
                        t.identifier("text"),
                        t.callExpression(
                            t.memberExpression(
                                t.memberExpression(t.identifier("ctx"), t.identifier("s")),
                                t.identifier("substring"),
                            ),
                            [
                                t.identifier("p"),
                                t.memberExpression(t.identifier("ctx"), t.identifier("p"))
                            ])
                    )
                ]
            ),
            // b.push(CstLeaf(text))
            storeLeaf(t.identifier("text")),
        ])
    ))

    // return r
    stmts.push(t.returnStatement(t.identifier("r")))

    return stmts
}

// A = B*
// A = (B A) | ""
// const A = (ctx, b) => {
//     const b2: Builder = []
//     let p = ctx.p;
//     while (p = ctx.p, B(ctx, b2))
//     ctx.p = p;
//     b.push(CstNode(b2))
//     return r
// }
export const generateStar = (node: g.Star, ruleName: string): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const b2: Builder = []
    stmts.push(createEmptyBuilder("b2"))

    stmts.push(t.variableDeclaration(
        'let',
        [
            t.variableDeclarator(t.identifier("p"), t.memberExpression(t.identifier("ctx"), t.identifier("p")))
        ]
    ))

    // while (B(ctx, b2))
    stmts.push(t.whileStatement(
        t.sequenceExpression(
            [
                t.assignmentExpression(
                    "=",
                    t.identifier("p"),
                    t.memberExpression(t.identifier("ctx"), t.identifier("p")),
                ),
                generateClause(node.expr, undefined, t.identifier("b2")),
            ]
        ),
        t.blockStatement([])
    ))

    // ctx.p = p
    stmts.push(t.expressionStatement(t.assignmentExpression(
        "=",
        t.memberExpression(t.identifier("ctx"), t.identifier("p")),
        t.identifier("p"),
    )))

    // if (b2.length > 0) {
    //    b.push(CstNode(b2))
    // }
    stmts.push(storeNodeIfNotEmpty(ruleName))

    // return true
    stmts.push(t.returnStatement(t.identifier("true")))
    return stmts
}

// A = B+
// const A = (ctx, b) => {
//     const b2: Builder = []
//     const r = B(ctx, b2);
//     if (r) {
//        let p = ctx.p;
//        while (p = ctx.p, B(ctx, b2))
//        ctx.p = p;
//     }
//     b.push(CstNode(b2))
//     return r
// }
export const generatePlus = (node: g.Plus, ruleName: string): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const b2: Builder = []
    stmts.push(createEmptyBuilder("b2"))

    // const r = B(ctx, b2);
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(node.expr, undefined, t.identifier("b2")))
        ]
    ))

    const clause = generateClause(node.expr, undefined, t.identifier("b2"))

    stmts.push(
        t.ifStatement(
            t.identifier("r"),
            t.blockStatement([
                t.variableDeclaration(
                    'let',
                    [
                        t.variableDeclarator(t.identifier("p"), t.memberExpression(t.identifier("ctx"), t.identifier("p")))
                    ]
                ),
                t.whileStatement(
                    t.sequenceExpression(
                        [
                            t.assignmentExpression(
                                "=",
                                t.identifier("p"),
                                t.memberExpression(t.identifier("ctx"), t.identifier("p")),
                            ),
                            clause,
                        ]
                    ),
                    t.blockStatement([])
                ),
                t.expressionStatement(t.assignmentExpression(
                    "=",
                    t.memberExpression(t.identifier("ctx"), t.identifier("p")),
                    t.identifier("p"),
                ))
            ])
        )
    )

    // if (b2.length > 0) {
    //    b.push(CstNode(b2))
    // }
    stmts.push(storeNodeIfNotEmpty(ruleName))

    // return true
    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

const compileClass = (node: g.Class, builderName: t.Expression, ctxName?: t.Expression) => {
    const expr = node.seqs.reduce((prev: undefined | t.Expression, seq): t.Expression => {
        let thisExpr: t.Expression

        switch (seq.$) {
            case 'ClassChar': {
                const char = seq.value
                // c === char
                thisExpr = t.binaryExpression(
                    '===',
                    t.identifier("c"),
                    t.stringLiteral(char)
                )
                break
            }
            case 'Group': {
                const from = seq.from
                const to = seq.to
                // c >= from && c <= to
                thisExpr = t.logicalExpression(
                    '&&',
                    t.binaryExpression('>=', t.identifier("c"), t.stringLiteral(from.value)),
                    t.binaryExpression('<=', t.identifier("c"), t.stringLiteral(to.value))
                )
                break
            }
            case "Named":
                // \r, \n, \t
                // c === "\r" || c === "\n" ...

                thisExpr = t.binaryExpression(
                    "===",
                    t.identifier("c"),
                    t.stringLiteral(seq.value === "n"
                        ? "\n" : seq.value === "t"
                            ? "\t" : seq.value === "r"
                                ? "\r" : seq.value === "b"
                                    ? "\b" : ""),
                )
                break
            case "SpecialClass":
                thisExpr = t.binaryExpression(
                    "===",
                    t.identifier("c"),
                    t.stringLiteral(compileEscape(seq)),
                )
                break
            default:
                throw new Error(`Unsupported class: ${seq.$}`)
        }

        if (!prev) {
            return thisExpr
        }

        return t.logicalExpression(
            "||",
            prev,
            thisExpr,
        )
    }, undefined as undefined | t.Expression)

    if (!expr) {
        throw new Error(`Something went wrong"`)
    }

    const finalExpr = node.negated ? t.unaryExpression("!", expr) : expr;
    return t.callExpression(
        t.identifier("consumeClass"),
        [
            ctxName ?? t.identifier("ctx"),
            builderName,
            t.arrowFunctionExpression(
                [t.identifier("c")],
                finalExpr,
            )
        ]
    )
}

// A = [a-z]
// const A = (ctx, b) => {
//     return consumeClass(ctx, b, (c) => c >= 'a' && c <= 'z')
// }
export const generateClass = (node: g.Class): t.Statement[] => {
    const stmts: t.Statement[] = []
    const expr = compileClass(node, t.identifier("b"));
    stmts.push(t.returnStatement(expr))
    return stmts
}

function isLowerCase(str: string) {
    return str === str.toLowerCase() &&
        str !== str.toUpperCase();
}

// // Or = A | B
// const Or = (ctx: Context, b: Builder): boolean => {
//    const b2: Builder = []
// 
//    const p = ctx.p
// 
//    let r = A(ctx, b2)
//    r = r || (ctx.p = p, B(ctx, b2))
// 
//    if (b2.length > 0) {
//        b.push(CstNode(b2))
//    }
//    return r
// }
export const generateAlt = (node: g.Alt, ruleName: string): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const b2: Builder = []
    stmts.push(createEmptyBuilder("b2"))

    const [head, ...tail] = node.exprs
    if (!head) {
        throw new Error("Seq must have at least one clause")
    }

    // const p = ctx.p
    stmts.push(saveCurrentPosition())

    // Foo = A | B
    // let r = A(ctx, b2)
    // let r = consumeToken("")
    stmts.push(t.variableDeclaration(
        'let',
        [
            t.variableDeclarator(
                t.identifier("r"),
                generateClause(head, undefined, t.identifier("b2"))
            )
        ]
    ))

    // r = r || (ctx.p = p, B(ctx, b2))
    for (const clause of tail) {
        stmts.push(t.expressionStatement(t.assignmentExpression(
            "=",
            t.identifier("r"),
            t.logicalExpression(
                "||",
                t.identifier("r"),
                t.sequenceExpression(
                    [
                        t.assignmentExpression(
                            "=",
                            t.memberExpression(t.identifier("ctx"), t.identifier("p")),
                            t.identifier("p")
                        ),
                        generateClause(clause, undefined, t.identifier("b2"))
                    ]
                )
            )
        )))
    }

    if (ruleName.length > 0 && isLowerCase(ruleName[0])) {
        // pushGroupTo(b, b2, "moduleItem")
        stmts.push(expressionStatement(t.callExpression(
            t.identifier("pushGroupTo"), [
                t.identifier("b"),
                t.identifier("b2"),
                t.stringLiteral(ruleName),
            ])))
    } else {
        // if (b2.length > 0) {
        //     b.push(CstNode(b2))
        // }
        stmts.push(storeNodeIfNotEmpty(ruleName))
    }

    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

// Seq = A B
// const Seq = (ctx: Context, b: Builder): boolean => {
//     const b2: Builder = []
//
//     const p = ctx.p
//
//     let r = A(ctx, b2)
//     r = r && B(ctx, b2)
//
//     if (r && b2.length > 0 {
//         b.push(CstNode(b2))
//     }
//
//     if (!r) {
//        ctx.p = p
//     }
//     return r
// }
export const generateSeq = (node: g.Seq, ruleName: string): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const b2: Builder = []
    stmts.push(createEmptyBuilder("b2"))

    // const p = ctx.p
    stmts.push(saveCurrentPosition())

    const [head, ...tail] = node.clauses
    if (!head) {
        throw new Error("Seq must have at least one clause")
    }

    // Foo = A B
    // let r = A(ctx, b2)
    // let r = consumeToken("some")
    stmts.push(t.variableDeclaration(
        'let',
        [
            t.variableDeclarator(
                t.identifier("r"),
                generateClause(head.expr, head.name, t.identifier("b2"))
            )
        ]
    ))

    // r = r && B(ctx, b2)
    for (const clause of tail) {
        stmts.push(t.expressionStatement(t.assignmentExpression(
            "=",
            t.identifier("r"),
            t.logicalExpression(
                "&&",
                t.identifier("r"),
                generateClause(clause.expr, clause.name, t.identifier("b2"))
            )
        )))
    }

    // if (r && b2.length > 0 {
    //     b.push(CstNode(b2))
    // }
    stmts.push(storeNodeIfMatched(ruleName))

    // if (!r) {
    //    ctx.p = p
    // }
    stmts.push(t.ifStatement(
        t.unaryExpression("!", t.identifier("r")),
        t.blockStatement([
            t.expressionStatement(t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier("ctx"), t.identifier("p")),
                t.identifier("p")
            ))
        ]),
    ))

    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

function compileAny(builderName: t.Expression, ctxName?: t.Expression) {
    return t.callExpression(t.identifier("consumeAny"), [
        ctxName ?? t.identifier("ctx"),
        builderName,
    ]);
}

export const generateClause = (expr: g.Expr,
                               fieldName: undefined | string,
                               builderName: t.Expression,
                               ctxName?:
                               t.Expression): t.Expression => {
    switch (expr.$) {
        case 'Call': {
            const args: t.Expression[] = [
                ctxName ?? t.identifier("ctx"),
                builderName,
                ...(fieldName ? [t.stringLiteral(fieldName)] : []),
            ]
            return t.callExpression(compileCall(expr), args)
        }
        case 'Terminal':
            return compileTerminal(expr, builderName)
        case "Class":
            return compileClass(expr, builderName, ctxName)
        case "Any":
            return compileAny(builderName, ctxName)
        default:
            throw new Error(`Unsupported expr2: ${expr.$}`)
    }
}

const compileTerminal = (node: g.Terminal, builderName: t.Expression): t.Expression => {
    const body = node.value.map(char => compileChar(char)).join('');

    let value;
    try {
        value = JSON.parse(`"${body}"`)
    } catch (e) {
        value = body
    }

    const wrapped = t.stringLiteral(value);
    return emitCall('consumeString', [t.identifier("ctx"), builderName, wrapped]);
};

const compileChar = (node: g.Escape | g.Special | g.Char): string => {
    switch (node.$) {
        case 'Char':
            return node.value;
        default:
            return compileEscape(node);
    }
};

const compileEscape = (node: g.Escape | g.Special | g.SpecialClass): string => {
    let expr = compileEscapeToString(node);

    const str = `"${expr}"`;

    try {
        return JSON.parse(str);
    } catch (e) {
        return str
    }
};

const compileEscapeToString = (node: g.Escape | g.Special | g.SpecialClass): string => {
    switch (node.$) {
        case 'Ascii':
            return `\\x${node.value}`;
        case 'Short':
            return `\\u${node.value}`;
        case 'Long':
            return `\\u{${node.value}}`;
        case 'Named':
            return `\\${node.value}`;
        case 'Special':
        case 'SpecialClass':
            return `\\${node.value}`;
    }
};

const emitCall = (name: string, args: t.Expression[], params?: t.TSType[]): t.Expression => {
    const result = t.callExpression(t.identifier(name), args);
    if (params && params.length > 0) {
        result.typeParameters = t.tsTypeParameterInstantiation(params);
    }
    return result;
};
