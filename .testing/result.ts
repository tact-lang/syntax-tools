

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
    readonly children: readonly Cst[],
}

export const CstLeaf = (text: string): CstLeaf => ({
    $: "leaf",
    text,
});

export const CstNode = (children: readonly Cst[]): CstNode => ({
    $: "node",
    children,
});

export type Result = [boolean, Cst]

export type Builder = Cst[]

const peek = (ctx: Context): string | undefined => {
    if (ctx.p === ctx.l) return undefined
    return ctx.s[ctx.p]
}

const consumeClass = (ctx: Context, cond: (c: string) => boolean): string | undefined => {
    if (ctx.p === ctx.l) return undefined
    const c = ctx.s[ctx.p]
    if (!cond(c)) return undefined
    ctx.p++;
    skip(ctx, [])
    return c
}

const consumeString = (ctx: Context, b: Builder, token: string): boolean => {
    if (ctx.s.substring(ctx.p, ctx.p + token.length) !== token) return false
    ctx.p += token.length
    const b2: Builder = []
    b2.push(CstLeaf(token))
    skip(ctx, b2)
    b.push(CstNode(b2))
    return true
}

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


export const File: Rule = (ctx, b) => {
  const b2: Builder = [];
  while (Func(ctx, b2)) {}
  b.push(CstNode(b2));
  return true;
};
export const Symbol: Rule = (ctx, b) => {
  const c = consumeClass(ctx, c => c >= "a" && c <= "z");
  if (c !== undefined) {
    b.push(CstLeaf(c));
    return true;
  }
  return false;
};
export const Ident_1: Rule = (ctx, b) => {
  const b2: Builder = [];
  const r = Symbol(ctx, b2);
  while (r && Symbol(ctx, b2)) {}
  b.push(CstNode(b2));
  return r;
};
export const Ident_2: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = Ident_1(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const Ident: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = Ident_2(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const Func: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = consumeString(ctx, b2, "fun");
  r = r && Ident(ctx, b2);
  r = r && consumeString(ctx, b2, "(");
  r = r && Params(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  r = r && Result(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && consumeString(ctx, b2, "}");
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Params: Rule = (ctx, b) => {
  const b2: Builder = [];
  while (Param(ctx, b2)) {}
  b.push(CstNode(b2));
  return true;
};
export const Param: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = Ident(ctx, b2);
  r = r && consumeString(ctx, b2, ":");
  r = r && Ident(ctx, b2);
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Result: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Result_1(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Result_1: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = consumeString(ctx, b2, ":");
  r = r && Ident(ctx, b2);
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const CommentContent: Rule = (ctx, b) => {
  const b2: Builder = [];
  while (Symbol(ctx, b2)) {}
  b.push(CstNode(b2));
  return true;
};
export const Comment: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = consumeString(ctx, b2, "// ");
  r = r && CommentContent(ctx, b2);
  r = r && consumeString(ctx, b2, "\n");
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const space: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b, " ");
  r = r || (ctx.p = p, consumeString(ctx, b, "\n"));
  r = r || (ctx.p = p, Comment(ctx, b2));
  b.push(CstNode(b2));
  return r;
};