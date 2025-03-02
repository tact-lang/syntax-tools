import { $ast as g } from '../grammar';

export type Expr =
    | Alt
    | Seq
    | Call
    | Class
    | Terminal
    | Any
    | LookNeg
    | LookPos
    | Lex
    | Star
    | Plus
    | Optional
    | Stringify

export type Escape = Named | Short | Long | Ascii;

export type SeqClause = {
    readonly expr: Expr,
    readonly name: undefined | string,
}

export const SeqClause = (expr: Expr, name: undefined | string): SeqClause => ({ expr, name });

export type Grammar = { readonly $: "Grammar", readonly rules: readonly Rule[] }
export const Grammar = (rules: readonly Rule[]): Grammar => ({ $: "Grammar", rules });
export type Rule = { readonly $: "Rule", readonly name: string, readonly formals: readonly string[], readonly body: Expr, readonly display: undefined | readonly (Char | Special | Escape)[] }
export const Rule = (name: string, formals: readonly string[], body: Expr, display: undefined | readonly (Char | Special | Escape)[]): Rule => ({ $: "Rule", name, formals, body, display });
export type Alt = { readonly $: "Alt", readonly exprs: readonly Expr[] }
export const Alt = (exprs: readonly Expr[]): Alt => ({ $: "Alt", exprs });
export type Seq = { readonly $: "Seq", readonly clauses: readonly SeqClause[] }
export const Seq = (clauses: readonly SeqClause[]): Seq => ({ $: "Seq", clauses });
export type LookNeg = { readonly $: "LookNeg", readonly expr: Expr }
export const LookNeg = (expr: Expr): LookNeg => ({ $: "LookNeg", expr });
export type LookPos = { readonly $: "LookPos", readonly expr: Expr }
export const LookPos = (expr: Expr): LookPos => ({ $: "LookPos", expr });
export type Lex = { readonly $: 'Lex', readonly expr: Expr }
export const Lex = (expr: Expr): Lex => ({ $: "Lex", expr });

export type Stringify = { readonly $: 'Stringify', readonly expr: Expr }
export const Stringify = (expr: Expr): Stringify => ({ $: "Stringify", expr });

export type Star = { readonly $: 'Star', readonly expr: Expr }
export const Star = (expr: Expr): Star => ({ $: "Star", expr });
export type Plus = { readonly $: 'Plus', readonly expr: Expr }
export const Plus = (expr: Expr): Plus => ({ $: "Plus", expr });
export type Optional = { readonly $: 'Optional', readonly expr: Expr }
export const Optional = (expr: Expr): Optional => ({ $: "Optional", expr });
export type Call = { readonly $: "Call", readonly name: string, readonly params: readonly Expr[] }
export const Call = (name: string, params: readonly Expr[]): Call => ({ $: "Call", name, params });
export type Class = { readonly $: "Class", readonly seqs: readonly (Group | ClassChar | SpecialClass | Escape)[], readonly negated: boolean }
export const Class = (seqs: readonly (Group | ClassChar | SpecialClass | Escape)[], negated: boolean): Class => ({ $: "Class", negated, seqs });
export type Group = { readonly $: "Group", readonly from: ClassChar | SpecialClass | Escape, readonly to: ClassChar | SpecialClass | Escape }
export const Group = (from: ClassChar | SpecialClass | Escape, to: ClassChar | SpecialClass | Escape): Group => ({ $: "Group", from, to });
export type ClassChar = { readonly $: "ClassChar", readonly value: string }
export const ClassChar = (value: string): ClassChar => ({ $: "ClassChar", value });
export type Terminal = { readonly $: "Terminal", readonly value: readonly (Char | Special | Escape)[] }
export const Terminal = (value: readonly (Char | Special | Escape)[]): Terminal => ({ $: "Terminal", value });
export type Any = { readonly $: "Any" }
export const Any: Any = ({ $: "Any" });
export type Char = { readonly $: "Char", readonly value: string }
export const Char = (value: string): Char => ({ $: "Char", value });
export type Special = { readonly $: "Special", readonly value: string }
export const Special = (value: string): Special => ({ $: "Special", value });
export type SpecialClass = { readonly $: "SpecialClass", readonly value: string }
export const SpecialClass = (value: string): SpecialClass => ({ $: "SpecialClass", value });
export type Named = { readonly $: "Named", readonly value: 'b' | 'n' | 'r' | 't' }
export const Named = (value: 'b' | 'n' | 'r' | 't'): Named => ({ $: "Named", value });
export type Short = { readonly $: "Short", readonly value: string }
export const Short = (value: string): Short => ({ $: "Short", value });
export type Long = { readonly $: "Long", readonly value: string }
export const Long = (value: string): Long => ({ $: "Long", value });
export type Ascii = { readonly $: "Ascii", readonly value: string }
export const Ascii = (value: string): Ascii => ({ $: "Ascii", value });

type Context = {
    formals: Set<string>;
    extraRules?: Rule[];
}
type Transform<T> = (ctx: Context) => T

const keywords: Set<string> = new Set([
    'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else',
    'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for',
    'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface',
    'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public',
    'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield',

    'as', 'type', 'interface', 'never', 'Function', 'string', 'number', 'boolean',
]);

const renameIfKeyword = (name: string): string => {
    return keywords.has(name) ? `$${name}` : name;
};

const transformRule = (
    { name, display, formals, body }: g.Rule
) => {
    const fullName = renameIfKeyword(name);

    const allFormals = formals ? [formals.head, ...formals.tail] : [];
    const formalsSet: Set<string> = new Set(allFormals);

    const expr = transformAlt(body)({
        formals: formalsSet,
    });

    return Rule(fullName, allFormals, expr, display);
};

type gExpr = g.Alt | g.Apply | g.Iter | g.Seq | g.Any | g.Class | g.Terminal

const transformExprs = (nodes: readonly gExpr[]): Transform<Expr[]> => (ctx) => {
    return nodes.map(expr => transformExpr(expr)(ctx));
};

const transformExpr = (node: gExpr): Transform<Expr> => (ctx) => {
    switch (node.$) {
        case 'Apply':
            return transformApply(node)(ctx);
        case 'Iter':
            return transformIter(node)(ctx);
        case 'Seq':
            return transformSeq(node)(ctx);
        case 'Alt':
            return transformAlt(node)(ctx);
        case 'Any':
            return transformAny(node)(ctx);
        case 'Class':
            return transformClass(node)(ctx);
        case 'Terminal':
            return transformTerminal(node)(ctx);
    }
};

const transformAny = (_node: g.Any): Transform<Expr> => () => {
    return Any;
};

const transformClass = ({ negated, seqs }: g.Class): Transform<Expr> => () => {
    return Class(seqs, negated === '^');
};

const transformTerminal = ({ value }: g.Terminal): Transform<Expr> => () => {
    return Terminal(value);
};

const transformApply = (node: g.Apply): Transform<Expr> => (ctx) => {
    const newName = renameIfKeyword(node.name);

    const allParams = node.params ? [node.params.head, ...node.params.tail] : [];

    return Call(newName, transformExprs(allParams)(ctx));
};

const transformAlt = (node: g.Alt): Transform<Expr> => (ctx) => {
    const exprs = [node.head, ...node.tail];
    if (exprs.length === 1 && exprs[0]) {
        return transformExpr(exprs[0])(ctx);
    }
    return Alt(transformExprs(exprs)(ctx));
};

const transformIter = ({ prefix, expr, suffix }: g.Iter): Transform<Expr> => {
    return prefix.reduceRight(
        (acc, prefix) => transformPrefix(prefix, acc),
        (ctx: Context) => transformSuffix(suffix, transformExpr(expr)(ctx)),
    );
};

const transformPrefix = (prefix: "!" | "&" | "#" | "$", expr: Transform<Expr>): Transform<Expr> => (ctx) => {
    switch (prefix) {
        case '!':
            return LookNeg(expr(ctx));
        case '&':
            return LookPos(expr(ctx));
        case '$':
            return Stringify(expr(ctx));
        case '#':
            return Lex(expr(ctx));
        default:
            throw new Error('Unexpected prefix');
    }
};

const transformSuffix = (suffix: "*" | "+" | "?" | undefined, expr: Expr): Expr => {
    switch (suffix) {
        case '*':
            return Star(expr);
        case '+':
            return Plus(expr);
        case '?':
            return Optional(expr);
        case undefined:
            return expr;
        default:
            throw new Error('Unexpected suffix');
    }
};

const transformSeq = ({ exprs }: g.Seq): Transform<Expr> => (ctx) => {
    const opts: Context = {
        formals: ctx.formals,
        extraRules: ctx.extraRules
    };

    if (exprs.length === 1 && exprs[0]) {
        return transformExpr(exprs[0].expr)(opts)
    }

    return Seq(
        exprs.map(({ expr, selector }) => ({
            expr: transformExpr(expr)(opts),
            name: selector?.$ === "Name" ? selector.name : undefined,
        }))
    );
};

export const desugar = ({rules}: g.Grammar): Grammar => {
    const ctx: Context = {
        formals: new Set(),
        extraRules: []
    };

    const mainRules = rules.flatMap((rule) => {
        return transformRule(rule);
    });

    const processedRules: Rule[] = [];
    for (const rule of mainRules) {
        const processedBody = processExpr(rule.body, rule.name, rule.formals, ctx, false);
        processedRules.push(Rule(rule.name, rule.formals, processedBody, rule.display));
    }

    const allRules = [...processedRules, ...(ctx.extraRules ?? [])];
    return Grammar(allRules);
};

const processExpr = (expr: Expr, ruleName: string, formals: readonly string[], ctx: Context, insideSeqAlt: boolean): Expr => {
    const params = formals.map(it => Call(it, []))

    switch (expr.$) {
        case 'Alt':
            const altExprs = expr.exprs.map(e => processExpr(e, ruleName, formals, ctx, true));

            if (insideSeqAlt && altExprs.length > 1) {
                const innerName = `${ruleName}_alt_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Alt(altExprs), undefined));
                return Call(innerName, params);
            }

            return Alt(altExprs);

        case 'Seq':
            const seqClauses = expr.clauses.map(clause => ({
                expr: processExpr(clause.expr, ruleName, formals, ctx, true),
                name: clause.name
            }));

            if (insideSeqAlt && seqClauses.length > 1) {
                const innerName = `${ruleName}_seq_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Seq(seqClauses), undefined));
                return Call(innerName, params);
            }

            return Seq(seqClauses);

        case 'Star':
            const starInner = processExpr(expr.expr, ruleName, formals, ctx, insideSeqAlt);

            if (insideSeqAlt || needsExtraction(starInner)) {
                const innerName = `${ruleName}_star_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Star(starInner), undefined));
                return Call(innerName, params);
            }

            return Star(starInner);

        case 'Plus':
            const plusInner = processExpr(expr.expr, ruleName, formals, ctx, insideSeqAlt);

            if (insideSeqAlt || needsExtraction(plusInner)) {
                const innerName = `${ruleName}_plus_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Plus(plusInner), undefined));
                return Call(innerName, params);
            }

            return Plus(plusInner);

        case 'Optional':
            const optInner = processExpr(expr.expr, ruleName, formals, ctx, insideSeqAlt);

            if (insideSeqAlt || needsExtraction(optInner)) {
                const innerName = `${ruleName}_opt_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Optional(optInner), undefined));
                return Call(innerName, params);
            }

            return Optional(optInner);

        case 'LookPos':
            const posInner = processExpr(expr.expr, ruleName, formals, ctx, insideSeqAlt);

            if (insideSeqAlt || needsExtraction(posInner)) {
                const innerName = `${ruleName}_pos_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, LookPos(posInner), undefined));
                return Call(innerName, params);
            }

            return LookPos(posInner);

        case 'LookNeg':
            const negInner = processExpr(expr.expr, ruleName, formals, ctx, insideSeqAlt);

            if (insideSeqAlt || needsExtraction(negInner)) {
                const innerName = `${ruleName}_neg_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, LookNeg(negInner), undefined));
                return Call(innerName, params);
            }

            return LookNeg(negInner);

        case 'Lex':
            const lexInner = processExpr(expr.expr, ruleName, formals, ctx, insideSeqAlt);

            if (insideSeqAlt || needsExtraction(lexInner)) {
                const innerName = `${ruleName}_lex_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Lex(lexInner), undefined));
                return Call(innerName, params);
            }

            return Lex(lexInner);

        case 'Stringify':
            const stringifyInner = processExpr(expr.expr, ruleName, formals, ctx, insideSeqAlt);

            if (insideSeqAlt || needsExtraction(stringifyInner)) {
                const innerName = `${ruleName}_stringify_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Stringify(stringifyInner), undefined));
                return Call(innerName, params);
            }

            return Stringify(stringifyInner);

        case 'Class':
            if (insideSeqAlt) {
                const innerName = `${ruleName}_class_${ctx.extraRules?.length || 0}`;
                ctx.extraRules = ctx.extraRules || [];
                ctx.extraRules.push(Rule(innerName, formals, Class(expr.seqs, expr.negated), undefined));
                return Call(innerName, params);
            }

            return expr;

        default:
            return expr;
    }
};

const needsExtraction = (expr: Expr): boolean => {
    if (expr.$ === 'Terminal' || expr.$ === 'Any' || expr.$ === 'Call') {
        return false;
    }

    if (expr.$ === 'Class') {
        return expr.seqs.length > 0;
    }

    return expr.$ === 'Seq' ||
        expr.$ === 'Alt' ||
        expr.$ === 'LookPos' ||
        expr.$ === 'LookNeg' ||
        expr.$ === 'Star' ||
        expr.$ === 'Plus' ||
        expr.$ === 'Stringify' ||
        expr.$ === 'Optional' ||
        expr.$ === 'Lex';
};
