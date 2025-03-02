import * as t from '@babel/types';
import * as g from './transform';
import {log} from 'console';

export const generate = (node: g.Grammar): t.File => {
    return t.file(t.program(
        node.rules.map((it) => generateRule(it))
    ))
}

export const generateRule = (node: g.Rule): t.ExportNamedDeclaration => {
    const name = t.identifier(node.name);
    name.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Rule")))

    return t.exportNamedDeclaration(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                name,
                t.arrowFunctionExpression(
                    [
                        t.identifier("ctx"),
                        t.identifier("b"),
                    ],
                    t.blockStatement(generateExpr(node.body))
                ),
            )
        ]
    ))
}

export const generateExpr = (node: g.Expr): t.Statement[] => {
    switch (node.$) {
        case 'Seq':
            return generateSeq(node)
        case 'Alt':
            return generateAlt(node)
        case 'Star':
            return generateStar(node)
        case 'Plus':
            return generatePlus(node)
        case 'Terminal':
            return generateSeq(g.Seq([g.SeqClause(node, undefined)]))
        case 'Class':
            return generateClass(node)
        case 'Stringify':
            return generateStringify(node)
        case 'Lex':
            return generateLex(node)
        // TODO
        // - transform rules to flat list
        // - check escapes
        // - positions
        // - fix nesting
        // - rules
        //   - generics
        //      - flatten rules must be generic as well
        //   - optionals
        //   - lookahead
        //   - negate lookahead
        //   - any
        //   - char class
        //      - [a-zA-Z]
        //      - [^\n\r]
        //      - ["{}]
        //      - [^\n\r]
        default:
            throw new Error(`Unsupported expr: ${node.$}`)
    }
}

// A = #B
// 
// const A = (ctx: Context, b: Builder, rule: Rule): boolean => {
//    const newCtx = {
//        ...ctx,
//        space: undefined,
//    }
// 
//    const r = A(newCtx, b)
//    ctx.p = newCtx.p
//    skip(ctx, b)
//    return r
// }
export const generateLex = (node: g.Lex): t.Statement[] => {
    const stmts: t.Statement[] = []

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

    // const r = A(newCtx, b)
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(node.expr, t.identifier("b"), t.identifier("newCtx")))
        ]
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
//     const text = ctx.s.substring(p, ctx.p)
//     b.push(CstLeaf(text))
//     return r
// }
export const generateStringify = (node: g.Stringify): t.Statement[] => {
    const stmts: t.Statement[] = []

    // const p = ctx.p
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("p"), t.memberExpression(t.identifier("ctx"), t.identifier("p")))
        ]
    ))

    // const r = B(ctx, []);
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(node.expr, t.arrayExpression([])))
        ]
    ))

    // const text = ctx.s.substring(p, ctx.p)
    stmts.push(t.variableDeclaration(
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
    ))

    // b.push(CstLeaf(text))
    stmts.push(t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.identifier("b"),
                t.identifier("push")
            ), [
                t.callExpression(t.identifier("CstLeaf"), [t.identifier("text")])
            ])
    ))

    // return r
    stmts.push(t.returnStatement(t.identifier("r")))

    return stmts
}

// A = B*
// const A = (ctx, b) => {
//     const b2: Builder = []
//     while (B(ctx, b2));
//     b.push(CstNode(b2))
//     return true
// }
export const generateStar = (node: g.Star): t.Statement[] => {
    const stmts: t.Statement[] = []

    const builderName = t.identifier("b2")
    builderName.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Builder")))

    // const b2: Builder = []
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                builderName,
                t.arrayExpression([])
            )
        ]
    ))

    // while (B(ctx, b2))
    stmts.push(t.whileStatement(
        generateClause(node.expr),
        t.blockStatement([])
    ))

    // b.push(CstNode(b2))
    stmts.push(t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.identifier("b"),
                t.identifier("push"),
            ), [
                t.callExpression(t.identifier("CstNode"), [builderName])
            ])
    ))

    stmts.push(t.returnStatement(t.identifier("true")))
    return stmts
}

// A = B+
// const A = (ctx, b) => {
//     const b2: Builder = []
//     const r = B(ctx, b2);
//     while (r && B(ctx, b2));
//     b.push(CstNode(b2))
//     return r
// }
export const generatePlus = (node: g.Plus): t.Statement[] => {
    const stmts: t.Statement[] = []

    const builderName = t.identifier("b2")
    builderName.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Builder")))

    // const b2: Builder = []
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                builderName,
                t.arrayExpression([])
            )
        ]
    ))

    // const r = B(ctx, b2);
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("r"), generateClause(node.expr))
        ]
    ))

    const clause = generateClause(node.expr)

    // while (r && B(ctx, b2))
    stmts.push(t.whileStatement(
        t.logicalExpression(
            '&&',
            t.identifier("r"),
            clause
        ),
        t.blockStatement([])
    ))

    // b.push(CstNode(b2))
    stmts.push(t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.identifier("b"),
                t.identifier("push")
            ), [
                t.callExpression(t.identifier("CstNode"), [builderName])
            ])
    ))

    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

// A = [a-z]
// const A = (ctx, b) => {
//     let c = consumeClass(ctx, (c) => c >= 'a' && c <= 'z')
//     if (c) {
//         return true
//     }
//     ctx.p++;
//     return false
// }
export const generateClass = (node: g.Class): t.Statement[] => {
    const stmts: t.Statement[] = []

    let expr: t.Expression

    switch (node.seqs[0].$) {
        case 'ClassChar': {
            const char = node.seqs[0].value
            // c === char
            expr = t.binaryExpression(
                '===',
                t.identifier("c"),
                t.stringLiteral(char)
            )
            break
        }
        case 'Group': {
            const from = node.seqs[0].from
            const to = node.seqs[0].to
            // c >= from && c <= to
            expr = t.logicalExpression(
                '&&',
                t.binaryExpression('>=', t.identifier("c"), t.stringLiteral(from.value)),
                t.binaryExpression('<=', t.identifier("c"), t.stringLiteral(to.value))
            )
            break
        }
        default:
            throw new Error(`Unsupported class: ${node.seqs[0].$}`)
    }

    // const c = consumeClass(ctx, (c) => c >= 'a' && c <= 'z')
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("c"), t.callExpression(
                t.identifier("consumeClass"),
                [
                    t.identifier("ctx"),
                    t.arrowFunctionExpression(
                        [t.identifier("c")],
                        expr,
                    )
                ]
            ))
        ]
    ))

    // if (c !== undefined) {
    //     b.push(CstLeaf(c))
    //     return true
    // }
    // return false
    stmts.push(t.ifStatement(
        t.binaryExpression(
            '!==',
            t.identifier("c"),
            t.identifier("undefined")
        ),
        t.blockStatement([
            t.expressionStatement(
                t.callExpression(
                    t.memberExpression(
                        t.identifier("b"),
                        t.identifier("push")
                    ), [
                        t.callExpression(
                            t.identifier("CstLeaf"),
                            [t.identifier("c")]
                        )
                    ]
                )
            ),
            t.returnStatement(t.identifier("true"))
        ]),
    ))

    stmts.push(t.returnStatement(t.identifier("false")))

    return stmts
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
//    b.push(CstNode(b2))
//    return r
// }
export const generateAlt = (node: g.Alt): t.Statement[] => {
    const stmts: t.Statement[] = []

    const builderName = t.identifier("b2")
    builderName.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Builder")))

    // const b2: Builder = []
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                builderName,
                t.arrayExpression([])
            )
        ]
    ))

    const [head, ...tail] = node.exprs
    if (!head) {
        throw new Error("Seq must have at least one clause")
    }

    // const p = ctx.p
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(t.identifier("p"), t.memberExpression(t.identifier("ctx"), t.identifier("p")))
        ]
    ))

    // Foo = A | B
    // let r = A(ctx, b2)
    // let r = consomeToken("")
    stmts.push(t.variableDeclaration(
        'let',
        [
            t.variableDeclarator(
                t.identifier("r"),
                generateClause(head)
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
                        generateClause(clause)
                    ]
                )
            )
        )))
    }

    // b.push(CstNode(b2))
    stmts.push(t.expressionStatement(
        t.callExpression(t.memberExpression(t.identifier("b"), t.identifier("push")), [
            t.callExpression(t.identifier("CstNode"), [builderName])
        ])
    ))

    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

// Seq = A B
// const Seq = (ctx: Context, b: Builder): boolean => {
//     const b2: Builder = []
// 
//     let r = A(ctx, b2)
//     r = r && B(ctx, b2)
// 
//     b.push(CstNode(b2))
//     return r
// }
export const generateSeq = (node: g.Seq): t.Statement[] => {
    const stmts: t.Statement[] = []

    const builderName = t.identifier("b2")
    builderName.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier("Builder")))

    // const b2: Builder = []
    stmts.push(t.variableDeclaration(
        'const',
        [
            t.variableDeclarator(
                builderName,
                t.arrayExpression([])
            )
        ]
    ))

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
                generateClause(head.expr, t.identifier("b2"))
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
                generateClause(clause.expr, t.identifier("b2"))
            )
        )))
    }

    // b.push(CstNode(b2))
    stmts.push(t.expressionStatement(
        t.callExpression(
            t.memberExpression(
                t.identifier("b"),
                t.identifier("push")
            ), [
                t.callExpression(t.identifier("CstNode"), [builderName])
            ])
    ))

    stmts.push(t.returnStatement(t.identifier("r")))
    return stmts
}

export const generateClause = (expr: g.Expr, builderName?: t.Expression, ctxName?: t.Expression): t.Expression => {
    switch (expr.$) {
        case 'Terminal':
            return compileTerminal(expr, builderName)
        case 'Call': {
            const args: t.Expression[] = [
                ctxName ?? t.identifier("ctx"),
                builderName ?? t.identifier("b2"),
            ]
            // if (expr.params.length !== 0) {
            //     return t.callExpression(emitCall(expr.name, expr.params.map((p) => generateClause(p))), args)
            // }
            return t.callExpression(t.identifier(expr.name), args)
        }
        default:
            throw new Error(`Unsupported expr2: ${expr.$}`)
    }
}

const compileTerminal = (node: g.Terminal, builderName?: t.Expression): t.Expression => {
    const body = node.value.map(char => compileChar(char)).join('');
    const value = JSON.parse(`"${body}"`);
    const wrapped = t.stringLiteral(value);
    return emitCall('consumeString', [t.identifier("ctx"), builderName ?? t.identifier("b"), wrapped]);
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
