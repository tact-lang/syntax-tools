import * as $ from '@tonstudio/parser-runtime';
import * as g from '../packages/pgen/cst/cst'
import * as G from '../packages/pgen/grammar';
import { desugar } from '../packages/pgen/cst/transform';
import generate from '@babel/generator';
import { inspect } from "util";
import * as fs from 'fs';
const log = (obj: unknown) => console.log(inspect(obj, { colors: true, depth: Infinity }));

const ast = $.parse({
    grammar: G.Grammar,
    space: G.space,
    text: fs.readFileSync("grammar.gg", "utf8"),
//
//         `
// File = Func*;
//
// Ident = #$([a-zA-Z]+);
// Func = "fun" Ident "(" Params ")" Result statements;
// Params = commaList<Param>?;
// Param = Ident ":" Type;
// Type = Ident;
// Result = (":" Type)?;
//
// statementsList = statement*;
// statements = "{" statementsList "}";
//
// statement
//     = StatementLet;
//
// StatementLet        = "let" name:Ident "=" Ident semicolon;
//
// semicolon = ";" / &"}";
//
// Comment = "//" $([^\\r\\n])*;
//
// multiLineComment = "/*" $(!"*/" .)* "*/";
//
// commaList<T> = inter<T, ","> ","?;
//
// inter<A, B> = head:A tail:(op:B right:A)*;
//
// space = " " / "\\\\n" / Comment / multiLineComment;
//
//     `,
});
if (ast.$ === 'error') {
    console.error(ast.error);
    process.exit(1);
}

const transformed = desugar(ast.value);
log(transformed)

const ast2 = g.generate(transformed)
// log(ast2)

const generated = generate(ast2, { minified: false }).code;

const header = `
let nextId = 0

export const createContext = (s: string, space: Rule) => ({
    s,
    p: 0,
    l: s.length,
    space,
});

export type Context = {
    s: string,
    p: number,
    l: number,
    space: undefined | Rule,
}

export type Rule = (ctx: Context, b: Builder) => boolean

export type Cst = CstLeaf | CstNode

export type CstLeaf = {
    readonly $: "leaf",
    readonly id: number,
    readonly text: string,
}

export type CstNode = {
    readonly $: "node",
    readonly id: number,
    readonly children: readonly Cst[],
}

export const CstLeaf = (text: string): CstLeaf => ({
    $: "leaf",
    id: nextId++,
    text,
});

export const CstNode = (children: readonly Cst[]): CstNode => ({
    $: "node",
    id: nextId++,
    children,
});

export type Result = [boolean, Cst]

export type Builder = Cst[]

const peek = (ctx: Context): string | undefined => {
    if (ctx.p === ctx.l) return undefined
    return ctx.s[ctx.p]
}

const consumeClass = (ctx: Context, b: Builder, cond: (c: string) => boolean): boolean => {
    if (ctx.p === ctx.l) return false
    const c = ctx.s[ctx.p]
    if (!cond(c)) return false
    ctx.p++;
    const b2: Builder = []
    b2.push(CstLeaf(c))
    skip(ctx, b2)
    if (b2.length > 0) {
        b.push(CstNode(b2))
    }
    return true
}

const consumeString = (ctx: Context, b: Builder, token: string): boolean => {
    if (ctx.s.substring(ctx.p, ctx.p + token.length) !== token) return false
    ctx.p += token.length
    const b2: Builder = []
    b2.push(CstLeaf(token))
    skip(ctx, b2)
    if (b2.length > 0) {
        b.push(CstNode(b2))
    }
    return true
}

export const consumeAny = (ctx: Context, b: Builder) => {
    if (ctx.p === ctx.l) {
        b.push(CstLeaf(""));
        return false;
    }

    const c = ctx.s[ctx.p];
    b.push(CstLeaf(c));
    ctx.p++;
    return true;
};

export const skip = (ctx: Context, b: Builder) => {
    const prevPos = ctx.p
    const newCtx = {
        ...ctx,
        space: undefined,
    }
    while (ctx.space?.(newCtx, []));
    ctx.p = newCtx.p
    const text = ctx.s.substring(prevPos, ctx.p)
    if (text.length > 0) {
        b.push(CstLeaf(text))
    }
}

const stringify = (ctx: Context, b: Builder, rule: Rule): boolean => {
    const p = ctx.p
    const r = rule(ctx, b)
    ctx.p = p
    return r
}

const lex = (ctx: Context, b: Builder, rule: Rule): boolean => {
    const newCtx = {
        ...ctx,
        space: undefined,
    }

    return rule(newCtx, b)
}


`

const result = header + generated

fs.writeFileSync(__dirname + "/result.ts", result)
