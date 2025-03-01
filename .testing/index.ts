// A = "hello" pin " world"
// B = A "!"
// C = B | ...


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
    readonly text: string,
}

export type CstNode = {
    readonly $: "node",
    readonly children: readonly CstNode[],
}

export const CstLeaf = (text: string): CstLeaf => ({
    $: "leaf",
    text,
});

export const CstNode = (children: readonly CstNode[]): CstNode => ({
    $: "node",
    children,
});

export type Result = [boolean, Cst]

export type Builder = CstNode[]

// Foo = .
const Foo = (ctx: Context, b: Builder): boolean => {
    if (ctx.p === ctx.l) {
        b.push(CstLeaf(""))
        return false
    }

    const c = ctx.s[ctx.p]
    b.push(CstLeaf(c))
    ctx.p++
    return true
}

// Seq = A B
const Seq = (ctx: Context, b: Builder): boolean => {
    const b2: Builder = []

    let r = A(ctx, b2)
    r = r && B(ctx, b2)

    b.push(CstNode(b2))
    return r
}

// Or = A | B
const Or = (ctx: Context, b: Builder): boolean => {
    const b2: Builder = []

    const p = ctx.p

    let r = A(ctx, b2)
    r = r || (ctx.p = p, B(ctx, b2))

    b.push(CstNode(b2))
    return r
}

// A = B | ""
const Opt = (ctx: Context, b: Builder): boolean => {
    const b2: Builder = []

    const p = ctx.p
    const r = B(ctx, b2)
    r = r || (ctx.p = p, true)

    b.push(CstNode(b2))
    return r
}

// A = B*
const Star = (ctx: Context, b: Builder): boolean => {
    const b2: Builder = []
    while (B(ctx, b2));
    b.push(CstNode(b2))
    return true
}

// A = B+
const Plus = (ctx: Context, b: Builder): boolean => {
    const b2: Builder = []
    B(ctx, b2)
    while (B(ctx, b2));
    b.push(CstNode(b2))
    return true
}

// If = "if" "(" Condition ")" Block ElseIfBranch* ElseBranch?
const If = (ctx: Context, b: Builder): boolean => {
    const b2: Builder = []
    let r = false, p = false;
    r = consume(ctx, "if")
    p = r
    r = consume(ctx, "(")
    r = r && Condition(ctx, b2)
    r = p && consume(ctx, ")") && r
    r = p && Block(ctx, b2) && r
    r = p && If_5(ctx, b2) && r
    r = p && If_6(ctx, b2) && r
    b.push(CstNode(b2))
    return r || p
}

// Foo = "foo"
const Foo = (ctx: Context, b: Builder): boolean => {
    if (!consume(ctx, "foo")) return false
    b.push(CstLeaf("foo"))
    ctx.p += 3
    return true
}

// Some = [a-z]
const Some = (ctx: Context, b: Builder): boolean => {
    if (ctx.p === ctx.l) return false
    const c = peek(ctx)
    if ("a" <= c && c <= "z") {
        b.push(CstLeaf(c))
        ctx.p++
        return true
    }
    return false
}

// keyword<T> = #(@T !idPart);

// Semicolon = ";" | &"}"
const Semicolon = (ctx: Context, b: Builder): boolean => {
    const p = ctx.p
    if (consume(ctx, ";")) {
        b.push(CstLeaf(";"))
        return true
    }
    
    // Lookahead for "}"
    if (ctx.s[ctx.p] === "}") {
        b.push(CstLeaf(";"))
        return true
    }
    return false
}

// Id = !ReservedWord [a-zA-Z_] idPart*;
const Id = (ctx: Context, b: Builder): boolean => {
    const p = ctx.p

    if (ReservedWord(ctx, [])) {
        ctx.p = p
        return false
    }

    const b3: Builder = []
    while (idPart(ctx, b3));
    b.push(CstNode(b3))
    return true
}

const ReservedWord = (ctx: Context, b: Builder): boolean => {
    const p = ctx.p
    if (consume(ctx, "if")) {
        b.push(CstLeaf("if"))
        return true
    }
    return false
}

const space = (ctx: Context, b: Builder): boolean => {
    while (consume(ctx, " ")) {
        b.push(CstLeaf(" "))
    }
    return true
}

const peek = (ctx: Context): string | undefined => {
    if (ctx.p === ctx.l) return undefined
    return ctx.s[ctx.p]
}

const consume = (ctx: Context, token: string): boolean => {
    if (ctx.s.substring(ctx.p, ctx.p + token.length) !== token) return false
    ctx.p += token.length
    return true
}

const lex = (ctx: Context, b: Builder, rule: Rule): boolean => {
    const newCtx = {
        ...ctx,
        space: undefined,
    }

    const r = rule(newCtx, b)
    ctx.p = newCtx.p
    skip(ctx, b)
    return r
}
