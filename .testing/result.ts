

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


export const File: Rule = (ctx, b) => {
  const b2: Builder = [];
  while (Func(ctx, b2)) {}
  b.push(CstNode(b2));
  return true;
};
export const Symbol: Rule = (ctx, b) => {
  const c = consumeClass(ctx, c => c >= "a" && c <= "z" || c >= "A" && c <= "Z");
  if (c !== undefined) {
    b.push(CstLeaf(c));
    return true;
  }
  return false;
};
export const Ident: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = Ident_stringify_1(newCtx, b);
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
  r = r && statements(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Params: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = commaList(Param)(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Param: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = Ident(ctx, b2);
  r = r && consumeString(ctx, b2, ":");
  r = r && Type(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Type: Rule = (ctx, b) => {
  return Ident(ctx, b);
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
  r = r && Type(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const statementsList: Rule = (ctx, b) => {
  const b2: Builder = [];
  while (statement(ctx, b2)) {}
  b.push(CstNode(b2));
  return true;
};
export const statements: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = consumeString(ctx, b2, "{");
  r = r && statementsList(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const statement: Rule = (ctx, b) => {
  return StatementLet(ctx, b);
};
export const StatementLet: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = consumeString(ctx, b2, "let");
  r = r && Ident(ctx, b2);
  r = r && consumeString(ctx, b2, "=");
  r = r && Ident(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const semicolon: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b, ";");
  r = r || (ctx.p = p, semicolon_pos_2(ctx, b2));
  b.push(CstNode(b2));
  return r;
};
export const Comment: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = consumeString(ctx, b2, "//");
  r = r && Comment_stringify_5(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const multiLineComment: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = consumeString(ctx, b2, "/*");
  r = r && multiLineComment_stringify_9(ctx, b2);
  r = r && consumeString(ctx, b2, "*/");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const commaList: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    let r = inter(T, (ctx, b) => consumeString(ctx, b, ","))(ctx, b2);
    r = r && commaList_opt_10(T)(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    return r;
  };
};
export const inter: (A: Rule, B: Rule) => Rule = (A, B) => {
  return (ctx, b) => {
    const b2: Builder = [];
    let r = A(ctx, b2);
    r = r && inter_star_12(A, B)(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    return r;
  };
};
export const space: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b, " ");
  r = r || (ctx.p = p, consumeString(ctx, b, "\n"));
  r = r || (ctx.p = p, Comment(ctx, b2));
  r = r || (ctx.p = p, multiLineComment(ctx, b2));
  b.push(CstNode(b2));
  return r;
};
export const Ident_plus_0: Rule = (ctx, b) => {
  const b2: Builder = [];
  const r = Symbol(ctx, b2);
  while (r && Symbol(ctx, b2)) {}
  b.push(CstNode(b2));
  return r;
};
export const Ident_stringify_1: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = Ident_plus_0(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const semicolon_pos_2: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = consumeString(ctx, b, "}");
  ctx.p = p;
  return r;
};
export const Comment_class_3: Rule = (ctx, b) => {
  const c = consumeClass(ctx, c => !(c === "\r" || c === "\n"));
  if (c !== undefined) {
    b.push(CstLeaf(c));
    return true;
  }
  return false;
};
export const Comment_star_4: Rule = (ctx, b) => {
  const b2: Builder = [];
  while (Comment_class_3(ctx, b2)) {}
  b.push(CstNode(b2));
  return true;
};
export const Comment_stringify_5: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = Comment_star_4(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const multiLineComment_neg_6: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = consumeString(ctx, b, "*/");
  ctx.p = p;
  return !r;
};
export const multiLineComment_seq_7: Rule = (ctx, b) => {
  const b2: Builder = [];
  let r = multiLineComment_neg_6(ctx, b2);
  r = r && consumeAny(ctx, b);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const multiLineComment_star_8: Rule = (ctx, b) => {
  const b2: Builder = [];
  while (multiLineComment_seq_7(ctx, b2)) {}
  b.push(CstNode(b2));
  return true;
};
export const multiLineComment_stringify_9: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = multiLineComment_star_8(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const commaList_opt_10: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = consumeString(ctx, b2, ",");
    r = r || (ctx.p = p, true);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    return r;
  };
};
export const inter_seq_11: (A: Rule, B: Rule) => Rule = (A, B) => {
  return (ctx, b) => {
    const b2: Builder = [];
    let r = B(ctx, b2);
    r = r && A(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    return r;
  };
};
export const inter_star_12: (A: Rule, B: Rule) => Rule = (A, B) => {
  return (ctx, b) => {
    const b2: Builder = [];
    while (inter_seq_11(A, B)(ctx, b2)) {}
    b.push(CstNode(b2));
    return true;
  };
};