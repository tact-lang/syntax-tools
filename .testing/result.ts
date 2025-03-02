
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


export const Module: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Module_star_0(ctx, b2);
  r = r && Module_star_1(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Import: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "import"))(ctx, b2);
  r = r && StringLiteral(ctx, b2);
  r = r && consumeString(ctx, b2, ";");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const moduleItem: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = PrimitiveTypeDecl(ctx, b2);
  r = r || (ctx.p = p, $Function(ctx, b2));
  r = r || (ctx.p = p, AsmFunction(ctx, b2));
  r = r || (ctx.p = p, NativeFunctionDecl(ctx, b2));
  r = r || (ctx.p = p, Constant(ctx, b2));
  r = r || (ctx.p = p, StructDecl(ctx, b2));
  r = r || (ctx.p = p, MessageDecl(ctx, b2));
  r = r || (ctx.p = p, Contract(ctx, b2));
  r = r || (ctx.p = p, Trait(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const contractItemDecl: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = ContractInit(ctx, b2);
  r = r || (ctx.p = p, Receiver(ctx, b2));
  r = r || (ctx.p = p, $Function(ctx, b2));
  r = r || (ctx.p = p, Constant(ctx, b2));
  r = r || (ctx.p = p, storageVar(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const traitItemDecl: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Receiver(ctx, b2);
  r = r || (ctx.p = p, $Function(ctx, b2));
  r = r || (ctx.p = p, Constant(ctx, b2));
  r = r || (ctx.p = p, storageVar(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const PrimitiveTypeDecl: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "primitive"))(ctx, b2);
  r = r && TypeId(ctx, b2);
  r = r && consumeString(ctx, b2, ";");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const $Function: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = $Function_star_2(ctx, b2);
  r = r && keyword((ctx, b) => consumeString(ctx, b, "fun"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && parameterList(Parameter)(ctx, b2);
  r = r && $Function_optional_3(ctx, b2);
  r = r && $Function_alt_4(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const FunctionDefinition: Rule = (ctx, b) => {
  return statements(ctx, b);
};
export const FunctionDeclaration: Rule = (ctx, b) => {
  return semicolon(ctx, b);
};
export const AsmFunction: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "asm");
  r = r && AsmFunction_optional_5(ctx, b2);
  r = r && AsmFunction_star_6(ctx, b2);
  r = r && keyword((ctx, b) => consumeString(ctx, b, "fun"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && parameterList(Parameter)(ctx, b2);
  r = r && AsmFunction_optional_7(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && assembly(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const shuffle: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "(");
  r = r && shuffle_star_8(ctx, b2);
  r = r && shuffle_optional_11(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const NativeFunctionDecl: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "@name");
  r = r && consumeString(ctx, b2, "(");
  r = r && NativeFunctionDecl_lex_12(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  r = r && NativeFunctionDecl_star_13(ctx, b2);
  r = r && keyword((ctx, b) => consumeString(ctx, b, "native"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && parameterList(Parameter)(ctx, b2);
  r = r && NativeFunctionDecl_optional_14(ctx, b2);
  r = r && consumeString(ctx, b2, ";");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Constant: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Constant_star_15(ctx, b2);
  r = r && keyword((ctx, b) => consumeString(ctx, b, "const"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && ascription(ctx, b2);
  r = r && Constant_alt_16(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const ConstantAttribute: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "virtual"))(ctx, b2);
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "override"))(ctx, b2));
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "abstract"))(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const ConstantDefinition: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "=");
  r = r && expression(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const ConstantDeclaration: Rule = (ctx, b) => {
  return semicolon(ctx, b);
};
export const storageVar: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = FieldDecl(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StructDecl: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "struct");
  r = r && TypeId(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && structFields(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const MessageDecl: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "message");
  r = r && MessageDecl_optional_18(ctx, b2);
  r = r && TypeId(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && structFields(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const structFields: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = structFields_optional_19(ctx, b2);
  r = r && structFields_optional_20(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const FieldDecl: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Id(ctx, b2);
  r = r && ascription(ctx, b2);
  r = r && FieldDecl_optional_22(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Contract: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Contract_star_23(ctx, b2);
  r = r && keyword((ctx, b) => consumeString(ctx, b, "contract"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && Contract_optional_24(ctx, b2);
  r = r && Contract_optional_25(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && Contract_star_26(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Trait: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Trait_star_27(ctx, b2);
  r = r && keyword((ctx, b) => consumeString(ctx, b, "trait"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && Trait_optional_28(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && Trait_star_29(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const inheritedTraits: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "with"))(ctx, b2);
  r = r && commaList(Id)(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const ContractInit: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "init");
  r = r && parameterList(Parameter)(ctx, b2);
  r = r && statements(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const ContractAttribute: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "@interface");
  r = r && consumeString(ctx, b2, "(");
  r = r && StringLiteral(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const FunctionAttribute: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = GetAttribute(ctx, b2);
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "mutates"))(ctx, b2));
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "extends"))(ctx, b2));
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "virtual"))(ctx, b2));
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "override"))(ctx, b2));
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "inline"))(ctx, b2));
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "abstract"))(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const GetAttribute: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "get");
  r = r && GetAttribute_optional_31(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Receiver: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = ReceiverType(ctx, b2);
  r = r && consumeString(ctx, b2, "(");
  r = r && receiverParam(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  r = r && statements(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const ReceiverType: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "bounced");
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "receive"))(ctx, b2));
  r = r || (ctx.p = p, keyword((ctx, b) => consumeString(ctx, b, "external"))(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const receiverParam: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = receiverParam_alt_32(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const assembly: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = assembly_stringify_33(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const assemblySequence: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, assemblyItem(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const assemblyItem: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = assemblyItem_seq_34(ctx, b2);
  r = r || (ctx.p = p, comment(ctx, b2));
  r = r || (ctx.p = p, assemblyItem_seq_36(ctx, b2));
  r = r || (ctx.p = p, assemblyItem_plus_40(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const ascription: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, ":");
  r = r && $type(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const $type: Rule = (ctx, b) => {
  return TypeAs(ctx, b);
};
export const TypeAs: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = TypeOptional(ctx, b2);
  r = r && TypeAs_star_42(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const TypeOptional: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = typePrimary(ctx, b2);
  r = r && TypeOptional_star_43(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const typePrimary: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = TypeGeneric(ctx, b2);
  r = r || (ctx.p = p, TypeRegular(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const TypeRegular: Rule = (ctx, b) => {
  return TypeId(ctx, b);
};
export const TypeGeneric: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = TypeGeneric_alt_44(ctx, b2);
  r = r && consumeString(ctx, b2, "<");
  r = r && commaList($type)(ctx, b2);
  r = r && consumeString(ctx, b2, ">");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const MapKeyword: Rule = (ctx, b) => {
  return keyword((ctx, b) => consumeString(ctx, b, "map"))(ctx, b);
};
export const Bounced: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "bounced");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const TypeId: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = TypeId_stringify_47(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const statement: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = StatementLet(ctx, b2);
  r = r || (ctx.p = p, StatementDestruct(ctx, b2));
  r = r || (ctx.p = p, StatementBlock(ctx, b2));
  r = r || (ctx.p = p, StatementReturn(ctx, b2));
  r = r || (ctx.p = p, StatementCondition(ctx, b2));
  r = r || (ctx.p = p, StatementWhile(ctx, b2));
  r = r || (ctx.p = p, StatementRepeat(ctx, b2));
  r = r || (ctx.p = p, StatementUntil(ctx, b2));
  r = r || (ctx.p = p, StatementTry(ctx, b2));
  r = r || (ctx.p = p, StatementForEach(ctx, b2));
  r = r || (ctx.p = p, StatementExpression(ctx, b2));
  r = r || (ctx.p = p, StatementAssign(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const statements: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "{");
  r = r && statements_star_48(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementLet: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "let"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && StatementLet_optional_49(ctx, b2);
  r = r && consumeString(ctx, b2, "=");
  r = r && expression(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementDestruct: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "let"))(ctx, b2);
  r = r && TypeId(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && inter(destructItem, (ctx, b) => consumeString(ctx, b, ","))(ctx, b2);
  r = r && optionalRest(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  r = r && consumeString(ctx, b2, "=");
  r = r && expression(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementBlock: Rule = (ctx, b) => {
  return statements(ctx, b);
};
export const StatementReturn: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "return"))(ctx, b2);
  r = r && StatementReturn_optional_50(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementExpression: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = expression(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementAssign: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = expression(ctx, b2);
  r = r && StatementAssign_optional_51(ctx, b2);
  r = r && consumeString(ctx, b2, "=");
  r = r && expression(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementCondition: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "if"))(ctx, b2);
  r = r && expression(ctx, b2);
  r = r && statements(ctx, b2);
  r = r && StatementCondition_optional_54(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementWhile: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "while"))(ctx, b2);
  r = r && parens(ctx, b2);
  r = r && statements(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementRepeat: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "repeat"))(ctx, b2);
  r = r && parens(ctx, b2);
  r = r && statements(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementUntil: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "do"))(ctx, b2);
  r = r && statements(ctx, b2);
  r = r && keyword((ctx, b) => consumeString(ctx, b, "until"))(ctx, b2);
  r = r && parens(ctx, b2);
  r = r && semicolon(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementTry: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "try"))(ctx, b2);
  r = r && statements(ctx, b2);
  r = r && StatementTry_optional_56(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementForEach: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "foreach"))(ctx, b2);
  r = r && consumeString(ctx, b2, "(");
  r = r && Id(ctx, b2);
  r = r && consumeString(ctx, b2, ",");
  r = r && Id(ctx, b2);
  r = r && consumeString(ctx, b2, "in");
  r = r && expression(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  r = r && statements(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const augmentedOp: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "||");
  r = r || (ctx.p = p, consumeString(ctx, b2, "&&"));
  r = r || (ctx.p = p, consumeString(ctx, b2, ">>"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "<<"));
  r = r || (ctx.p = p, consumeClass(ctx, b2, c => c === "-" || c === "+" || c === "*" || c === "/" || c === "%" || c === "|" || c === "&" || c === "^"));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const FalseBranch: Rule = (ctx, b) => {
  return statements(ctx, b);
};
export const semicolon: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, ";");
  r = r || (ctx.p = p, semicolon_lookpos_57(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const destructItem: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = RegularField(ctx, b2);
  r = r || (ctx.p = p, PunnedField(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const RegularField: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Id(ctx, b2);
  r = r && consumeString(ctx, b2, ":");
  r = r && Id(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const PunnedField: Rule = (ctx, b) => {
  return Id(ctx, b);
};
export const optionalRest: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = optionalRest_seq_58(ctx, b2);
  r = r || (ctx.p = p, NoRestArgument(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const RestArgument: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "..");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const NoRestArgument: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, ",");
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const expression: Rule = (ctx, b) => {
  return Conditional(ctx, b);
};
export const Conditional: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = or(ctx, b2);
  r = r && Conditional_optional_60(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const or: Rule = (ctx, b) => {
  return Binary(and, (ctx, b) => consumeString(ctx, b, "||"))(ctx, b);
};
export const and: Rule = (ctx, b) => {
  return Binary(bitwiseOr, (ctx, b) => consumeString(ctx, b, "&&"))(ctx, b);
};
export const bitwiseOr: Rule = (ctx, b) => {
  return Binary(bitwiseXor, (ctx, b) => consumeString(ctx, b, "|"))(ctx, b);
};
export const bitwiseXor: Rule = (ctx, b) => {
  return Binary(bitwiseAnd, (ctx, b) => consumeString(ctx, b, "^"))(ctx, b);
};
export const bitwiseAnd: Rule = (ctx, b) => {
  return Binary(equality, (ctx, b) => consumeString(ctx, b, "&"))(ctx, b);
};
export const equality: Rule = (ctx, b) => {
  return Binary(compare, equality_alt_61)(ctx, b);
};
export const compare: Rule = (ctx, b) => {
  return Binary(bitwiseShift, compare_alt_62)(ctx, b);
};
export const bitwiseShift: Rule = (ctx, b) => {
  return Binary(add, bitwiseShift_alt_63)(ctx, b);
};
export const add: Rule = (ctx, b) => {
  return Binary(mul, add_alt_64)(ctx, b);
};
export const mul: Rule = (ctx, b) => {
  return Binary(Unary, (ctx, b) => consumeClass(ctx, b, c => c === "*" || c === "/" || c === "%"))(ctx, b);
};
export const Unary: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Unary_star_65(ctx, b2);
  r = r && Suffix(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Suffix: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = primary(ctx, b2);
  r = r && Suffix_star_66(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Binary: (T: Rule, U: Rule) => Rule = (T, U) => {
  return (ctx, b) => {
    return inter(T, Operator(U))(ctx, b);
  };
};
export const Operator: (U: Rule) => Rule = U => {
  return (ctx, b) => {
    return U(ctx, b);
  };
};
export const suffix: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = SuffixUnboxNotNull(ctx, b2);
  r = r || (ctx.p = p, SuffixCall(ctx, b2));
  r = r || (ctx.p = p, SuffixFieldAccess(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const SuffixUnboxNotNull: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "!!");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const SuffixCall: Rule = (ctx, b) => {
  return parameterList(expression)(ctx, b);
};
export const SuffixFieldAccess: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, ".");
  r = r && Id(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const primary: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Parens(ctx, b2);
  r = r || (ctx.p = p, StructInstance(ctx, b2));
  r = r || (ctx.p = p, IntegerLiteral(ctx, b2));
  r = r || (ctx.p = p, BoolLiteral(ctx, b2));
  r = r || (ctx.p = p, InitOf(ctx, b2));
  r = r || (ctx.p = p, CodeOf(ctx, b2));
  r = r || (ctx.p = p, Null(ctx, b2));
  r = r || (ctx.p = p, StringLiteral(ctx, b2));
  r = r || (ctx.p = p, Id(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Null: Rule = (ctx, b) => {
  return keyword((ctx, b) => consumeString(ctx, b, "null"))(ctx, b);
};
export const parens: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "(");
  r = r && expression(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Parens: Rule = (ctx, b) => {
  return parens(ctx, b);
};
export const StructInstance: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = TypeId(ctx, b2);
  r = r && consumeString(ctx, b2, "{");
  r = r && StructInstance_optional_67(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const InitOf: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "initOf"))(ctx, b2);
  r = r && Id(ctx, b2);
  r = r && parameterList(expression)(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const CodeOf: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "codeOf");
  r = r && Id(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StructFieldInitializer: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Id(ctx, b2);
  r = r && StructFieldInitializer_optional_69(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const parameterList: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = consumeString(ctx, b2, "(");
    r = r && parameterList_optional_70(T)(ctx, b2);
    r = r && consumeString(ctx, b2, ")");
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    if (!r) {
      ctx.p = p;
    }
    return r;
  };
};
export const Parameter: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Id(ctx, b2);
  r = r && ascription(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const commaList: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = inter(T, (ctx, b) => consumeString(ctx, b, ","))(ctx, b2);
    r = r && commaList_optional_71(T)(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    if (!r) {
      ctx.p = p;
    }
    return r;
  };
};
export const IntegerLiteral: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = IntegerLiteralHex(ctx, b2);
  r = r || (ctx.p = p, IntegerLiteralBin(ctx, b2));
  r = r || (ctx.p = p, IntegerLiteralOct(ctx, b2));
  r = r || (ctx.p = p, IntegerLiteralDec(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const IntegerLiteralDec: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = underscored(digit)(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const IntegerLiteralHex: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = IntegerLiteralHex_seq_72(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const IntegerLiteralBin: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = IntegerLiteralBin_seq_73(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const IntegerLiteralOct: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = IntegerLiteralOct_seq_74(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const underscored: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const p = ctx.p;
    const r = underscored_seq_78(T)(ctx, []);
    const text = ctx.s.substring(p, ctx.p);
    b.push(CstLeaf(text));
    return r;
  };
};
export const digit: Rule = (ctx, b) => {
  return consumeClass(ctx, b, c => c >= "0" && c <= "9");
};
export const idPart: Rule = (ctx, b) => {
  return consumeClass(ctx, b, c => c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "_");
};
export const Id: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = Id_stringify_82(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const FuncId: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = FuncId_optional_83(ctx, b2);
  r = r && FuncId_stringify_88(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const BoolLiteral: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = BoolLiteral_alt_89(ctx, b2);
  r = r && BoolLiteral_lookneg_90(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StringLiteral: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = StringLiteral_seq_95(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const escapeChar: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeClass(ctx, b2, c => c === "\\" || c === "\"" || c === "n" || c === "r" || c === "t" || c === "v" || c === "b" || c === "f");
  r = r || (ctx.p = p, escapeChar_seq_103(ctx, b2));
  r = r || (ctx.p = p, escapeChar_seq_106(ctx, b2));
  r = r || (ctx.p = p, escapeChar_seq_109(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const hexDigit: Rule = (ctx, b) => {
  return consumeClass(ctx, b, c => c >= "0" && c <= "9" || c >= "a" && c <= "f" || c >= "A" && c <= "F");
};
export const keyword: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const newCtx = {
      ...ctx,
      space: undefined
    };
    const r = keyword_seq_111(T)(newCtx, b);
    ctx.p = newCtx.p;
    skip(ctx, b);
    return r;
  };
};
export const reservedWord: Rule = (ctx, b) => {
  return keyword(reservedWord_alt_112)(ctx, b);
};
export const space: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeClass(ctx, b2, c => c === " " || c === "\t" || c === "\r" || c === "\n");
  r = r || (ctx.p = p, comment(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const comment: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = multiLineComment(ctx, b2);
  r = r || (ctx.p = p, singleLineComment(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const multiLineComment: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "/*");
  r = r && multiLineComment_stringify_116(ctx, b2);
  r = r && consumeString(ctx, b2, "*/");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const singleLineComment: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "//");
  r = r && singleLineComment_stringify_118(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const JustImports: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = JustImports_star_119(ctx, b2);
  r = r && JustImports_star_120(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const inter: (A: Rule, B: Rule) => Rule = (A, B) => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = A(ctx, b2);
    r = r && inter_star_122(A, B)(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    if (!r) {
      ctx.p = p;
    }
    return r;
  };
};
export const Module_star_0: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, Import(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const Module_star_1: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, moduleItem(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const $Function_star_2: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, FunctionAttribute(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const $Function_optional_3: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = ascription(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const $Function_alt_4: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = FunctionDefinition(ctx, b2);
  r = r || (ctx.p = p, FunctionDeclaration(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const AsmFunction_optional_5: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = shuffle(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const AsmFunction_star_6: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, FunctionAttribute(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const AsmFunction_optional_7: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = ascription(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const shuffle_star_8: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, Id(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const shuffle_plus_9: Rule = (ctx, b) => {
  const b2: Builder = [];
  const r = IntegerLiteralDec(ctx, b2);
  if (r) {
    let p = ctx.p;
    while (p = ctx.p, IntegerLiteralDec(ctx, b2)) {}
    ctx.p = p;
  }
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const shuffle_seq_10: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "->");
  r = r && shuffle_plus_9(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const shuffle_optional_11: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = shuffle_seq_10(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const NativeFunctionDecl_lex_12: Rule = (ctx, b) => {
  const newCtx = {
    ...ctx,
    space: undefined
  };
  const r = FuncId(newCtx, b);
  ctx.p = newCtx.p;
  skip(ctx, b);
  return r;
};
export const NativeFunctionDecl_star_13: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, FunctionAttribute(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const NativeFunctionDecl_optional_14: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = ascription(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Constant_star_15: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, ConstantAttribute(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const Constant_alt_16: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = ConstantDefinition(ctx, b2);
  r = r || (ctx.p = p, ConstantDeclaration(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const MessageDecl_seq_17: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "(");
  r = r && expression(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const MessageDecl_optional_18: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = MessageDecl_seq_17(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const structFields_optional_19: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = inter(FieldDecl, (ctx, b) => consumeString(ctx, b, ";"))(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const structFields_optional_20: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, ";");
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const FieldDecl_seq_21: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "=");
  r = r && expression(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const FieldDecl_optional_22: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = FieldDecl_seq_21(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Contract_star_23: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, ContractAttribute(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const Contract_optional_24: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = parameterList(Parameter)(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Contract_optional_25: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = inheritedTraits(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Contract_star_26: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, contractItemDecl(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const Trait_star_27: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, ContractAttribute(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const Trait_optional_28: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = inheritedTraits(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Trait_star_29: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, traitItemDecl(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const GetAttribute_seq_30: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "(");
  r = r && expression(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const GetAttribute_optional_31: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = GetAttribute_seq_30(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const receiverParam_alt_32: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Parameter(ctx, b2);
  r = r || (ctx.p = p, StringLiteral(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const assembly_stringify_33: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = assemblySequence(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const assemblyItem_seq_34: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "{");
  r = r && assemblySequence(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const assemblyItem_star_35: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, consumeClass(ctx, b2, c => !(c === "\""))) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const assemblyItem_seq_36: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "\"");
  r = r && assemblyItem_star_35(ctx, b2);
  r = r && consumeString(ctx, b2, "\"");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const assemblyItem_alt_37: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeClass(ctx, b2, c => c === "\"" || c === "{" || c === "}");
  r = r || (ctx.p = p, consumeString(ctx, b2, "//"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "/*"));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const assemblyItem_lookneg_38: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = assemblyItem_alt_37(ctx, b);
  ctx.p = p;
  return !r;
};
export const assemblyItem_seq_39: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = assemblyItem_lookneg_38(ctx, b2);
  r = r && consumeAny(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const assemblyItem_plus_40: Rule = (ctx, b) => {
  const b2: Builder = [];
  const r = assemblyItem_seq_39(ctx, b2);
  if (r) {
    let p = ctx.p;
    while (p = ctx.p, assemblyItem_seq_39(ctx, b2)) {}
    ctx.p = p;
  }
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const TypeAs_seq_41: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "as"))(ctx, b2);
  r = r && Id(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const TypeAs_star_42: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, TypeAs_seq_41(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const TypeOptional_star_43: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, consumeString(ctx, b2, "?")) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const TypeGeneric_alt_44: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = MapKeyword(ctx, b2);
  r = r || (ctx.p = p, Bounced(ctx, b2));
  r = r || (ctx.p = p, TypeId(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const TypeId_star_45: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, consumeClass(ctx, b2, c => c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "_")) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const TypeId_seq_46: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeClass(ctx, b2, c => c >= "A" && c <= "Z");
  r = r && TypeId_star_45(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const TypeId_stringify_47: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = TypeId_seq_46(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const statements_star_48: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, statement(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const StatementLet_optional_49: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = ascription(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const StatementReturn_optional_50: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = expression(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const StatementAssign_optional_51: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = augmentedOp(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const StatementCondition_alt_52: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = FalseBranch(ctx, b2);
  r = r || (ctx.p = p, StatementCondition(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const StatementCondition_seq_53: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "else"))(ctx, b2);
  r = r && StatementCondition_alt_52(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementCondition_optional_54: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = StatementCondition_seq_53(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const StatementTry_seq_55: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = keyword((ctx, b) => consumeString(ctx, b, "catch"))(ctx, b2);
  r = r && consumeString(ctx, b2, "(");
  r = r && Id(ctx, b2);
  r = r && consumeString(ctx, b2, ")");
  r = r && statements(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StatementTry_optional_56: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = StatementTry_seq_55(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const semicolon_lookpos_57: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = consumeString(ctx, [], "}");
  ctx.p = p;
  return r;
};
export const optionalRest_seq_58: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, ",");
  r = r && RestArgument(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Conditional_seq_59: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "?");
  r = r && or(ctx, b2);
  r = r && consumeString(ctx, b2, ":");
  r = r && Conditional(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Conditional_optional_60: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Conditional_seq_59(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const equality_alt_61: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "!=");
  r = r || (ctx.p = p, consumeString(ctx, b2, "=="));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const compare_alt_62: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "<=");
  r = r || (ctx.p = p, consumeString(ctx, b2, "<"));
  r = r || (ctx.p = p, consumeString(ctx, b2, ">="));
  r = r || (ctx.p = p, consumeString(ctx, b2, ">"));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const bitwiseShift_alt_63: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "<<");
  r = r || (ctx.p = p, consumeString(ctx, b2, ">>"));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const add_alt_64: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "+");
  r = r || (ctx.p = p, consumeString(ctx, b2, "-"));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const Unary_star_65: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, Operator((ctx, b) => consumeClass(ctx, b, c => c === "-" || c === "+" || c === "!" || c === "~"))(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const Suffix_star_66: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, suffix(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const StructInstance_optional_67: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = commaList(StructFieldInitializer)(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const StructFieldInitializer_seq_68: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, ":");
  r = r && expression(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StructFieldInitializer_optional_69: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = StructFieldInitializer_seq_68(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const parameterList_optional_70: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = commaList(T)(ctx, b2);
    r = r || (ctx.p = p, true);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    return r;
  };
};
export const commaList_optional_71: (T: Rule) => Rule = T => {
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
export const IntegerLiteralHex_seq_72: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "0");
  r = r && consumeClass(ctx, b2, c => c === "x" || c === "X");
  r = r && underscored(hexDigit)(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const IntegerLiteralBin_seq_73: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "0");
  r = r && consumeClass(ctx, b2, c => c === "b" || c === "B");
  r = r && underscored((ctx, b) => consumeClass(ctx, b, c => c === "0" || c === "1"))(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const IntegerLiteralOct_seq_74: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "0");
  r = r && consumeClass(ctx, b2, c => c === "o" || c === "O");
  r = r && underscored((ctx, b) => consumeClass(ctx, b, c => c >= "0" && c <= "7"))(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const underscored_optional_75: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = consumeString(ctx, b2, "_");
    r = r || (ctx.p = p, true);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    return r;
  };
};
export const underscored_seq_76: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = underscored_optional_75(T)(ctx, b2);
    r = r && T(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    if (!r) {
      ctx.p = p;
    }
    return r;
  };
};
export const underscored_star_77: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    let p = ctx.p;
    while (p = ctx.p, underscored_seq_76(T)(ctx, b2)) {}
    ctx.p = p;
    if (b2.length > 0) {
      b.push(CstNode(b2));
    }
    return true;
  };
};
export const underscored_seq_78: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = T(ctx, b2);
    r = r && underscored_star_77(T)(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    if (!r) {
      ctx.p = p;
    }
    return r;
  };
};
export const Id_lookneg_79: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = reservedWord(ctx, b);
  ctx.p = p;
  return !r;
};
export const Id_star_80: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, idPart(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const Id_seq_81: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = Id_lookneg_79(ctx, b2);
  r = r && consumeClass(ctx, b2, c => c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "_");
  r = r && Id_star_80(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const Id_stringify_82: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = Id_seq_81(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const FuncId_optional_83: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeClass(ctx, b2, c => c === "." || c === "~");
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const FuncId_plus_84: Rule = (ctx, b) => {
  const b2: Builder = [];
  const r = consumeClass(ctx, b2, c => !(c === "`" || c === "\r" || c === "\n"));
  if (r) {
    let p = ctx.p;
    while (p = ctx.p, consumeClass(ctx, b2, c => !(c === "`" || c === "\r" || c === "\n"))) {}
    ctx.p = p;
  }
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const FuncId_seq_85: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "`");
  r = r && FuncId_plus_84(ctx, b2);
  r = r && consumeString(ctx, b2, "`");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const FuncId_plus_86: Rule = (ctx, b) => {
  const b2: Builder = [];
  const r = consumeClass(ctx, b2, c => !(c === " " || c === "\t" || c === "\r" || c === "\n" || c === "(" || c === ")" || c === "[" || c === "\"\\]\"" || c === "," || c === "." || c === ";" || c === "~"));
  if (r) {
    let p = ctx.p;
    while (p = ctx.p, consumeClass(ctx, b2, c => !(c === " " || c === "\t" || c === "\r" || c === "\n" || c === "(" || c === ")" || c === "[" || c === "\"\\]\"" || c === "," || c === "." || c === ";" || c === "~"))) {}
    ctx.p = p;
  }
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const FuncId_alt_87: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = FuncId_seq_85(ctx, b2);
  r = r || (ctx.p = p, FuncId_plus_86(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const FuncId_stringify_88: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = FuncId_alt_87(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const BoolLiteral_alt_89: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "true");
  r = r || (ctx.p = p, consumeString(ctx, b2, "false"));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const BoolLiteral_lookneg_90: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = idPart(ctx, b);
  ctx.p = p;
  return !r;
};
export const StringLiteral_seq_91: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "\\");
  r = r && escapeChar(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const StringLiteral_alt_92: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeClass(ctx, b2, c => !(c === "\"" || c === "\\"));
  r = r || (ctx.p = p, StringLiteral_seq_91(ctx, b2));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const StringLiteral_star_93: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, StringLiteral_alt_92(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const StringLiteral_stringify_94: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = StringLiteral_star_93(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const StringLiteral_seq_95: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "\"");
  r = r && StringLiteral_stringify_94(ctx, b2);
  r = r && consumeString(ctx, b2, "\"");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const escapeChar_optional_96: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const escapeChar_optional_97: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const escapeChar_optional_98: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const escapeChar_optional_99: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const escapeChar_optional_100: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r || (ctx.p = p, true);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const escapeChar_seq_101: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r && escapeChar_optional_96(ctx, b2);
  r = r && escapeChar_optional_97(ctx, b2);
  r = r && escapeChar_optional_98(ctx, b2);
  r = r && escapeChar_optional_99(ctx, b2);
  r = r && escapeChar_optional_100(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const escapeChar_stringify_102: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = escapeChar_seq_101(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const escapeChar_seq_103: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "u{");
  r = r && escapeChar_stringify_102(ctx, b2);
  r = r && consumeString(ctx, b2, "}");
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const escapeChar_seq_104: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r && hexDigit(ctx, b2);
  r = r && hexDigit(ctx, b2);
  r = r && hexDigit(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const escapeChar_stringify_105: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = escapeChar_seq_104(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const escapeChar_seq_106: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "u");
  r = r && escapeChar_stringify_105(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const escapeChar_seq_107: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = hexDigit(ctx, b2);
  r = r && hexDigit(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const escapeChar_stringify_108: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = escapeChar_seq_107(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const escapeChar_seq_109: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "x");
  r = r && escapeChar_stringify_108(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const keyword_lookneg_110: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const p = ctx.p;
    const r = idPart(ctx, b);
    ctx.p = p;
    return !r;
  };
};
export const keyword_seq_111: (T: Rule) => Rule = T => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = T(ctx, b2);
    r = r && keyword_lookneg_110(T)(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    if (!r) {
      ctx.p = p;
    }
    return r;
  };
};
export const reservedWord_alt_112: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = consumeString(ctx, b2, "extend");
  r = r || (ctx.p = p, consumeString(ctx, b2, "public"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "fun"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "let"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "return"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "receive"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "native"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "primitive"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "null"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "if"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "else"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "while"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "repeat"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "do"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "until"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "try"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "catch"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "foreach"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "as"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "map"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "mutates"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "extends"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "external"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "import"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "with"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "trait"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "initOf"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "override"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "abstract"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "virtual"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "inline"));
  r = r || (ctx.p = p, consumeString(ctx, b2, "const"));
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return r;
};
export const multiLineComment_lookneg_113: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = consumeString(ctx, b, "*/");
  ctx.p = p;
  return !r;
};
export const multiLineComment_seq_114: Rule = (ctx, b) => {
  const b2: Builder = [];
  const p = ctx.p;
  let r = multiLineComment_lookneg_113(ctx, b2);
  r = r && consumeAny(ctx, b2);
  if (r && b2.length > 0) {
    b.push(CstNode(b2));
  }
  if (!r) {
    ctx.p = p;
  }
  return r;
};
export const multiLineComment_star_115: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, multiLineComment_seq_114(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const multiLineComment_stringify_116: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = multiLineComment_star_115(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const singleLineComment_star_117: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, consumeClass(ctx, b2, c => !(c === "\r" || c === "\n"))) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const singleLineComment_stringify_118: Rule = (ctx, b) => {
  const p = ctx.p;
  const r = singleLineComment_star_117(ctx, []);
  const text = ctx.s.substring(p, ctx.p);
  b.push(CstLeaf(text));
  return r;
};
export const JustImports_star_119: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, Import(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const JustImports_star_120: Rule = (ctx, b) => {
  const b2: Builder = [];
  let p = ctx.p;
  while (p = ctx.p, consumeAny(ctx, b2)) {}
  ctx.p = p;
  if (b2.length > 0) {
    b.push(CstNode(b2));
  }
  return true;
};
export const inter_seq_121: (A: Rule, B: Rule) => Rule = (A, B) => {
  return (ctx, b) => {
    const b2: Builder = [];
    const p = ctx.p;
    let r = B(ctx, b2);
    r = r && A(ctx, b2);
    if (r && b2.length > 0) {
      b.push(CstNode(b2));
    }
    if (!r) {
      ctx.p = p;
    }
    return r;
  };
};
export const inter_star_122: (A: Rule, B: Rule) => Rule = (A, B) => {
  return (ctx, b) => {
    const b2: Builder = [];
    let p = ctx.p;
    while (p = ctx.p, inter_seq_121(A, B)(ctx, b2)) {}
    ctx.p = p;
    if (b2.length > 0) {
      b.push(CstNode(b2));
    }
    return true;
  };
};
