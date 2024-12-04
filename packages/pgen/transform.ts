import { $$ as g } from './grammar';

export type Expr =
    | Alt
    | Eps
    | Pure
    | Ap
    | Field
    | Call
    | Class
    | Terminal
    | Any
    | LookNeg
    | LookPos
    | Stringify
    | Star
    | Plus
    | Optional
export type Escape = Named | Short | Long | Ascii;
export type Mode = 'l' | 'r'

export type Grammar = { readonly $: "Grammar", readonly rules: readonly Rule[] }
export const Grammar = (rules: readonly Rule[]): Grammar => ({ $: "Grammar", rules });
export type Rule = { readonly $: "Rule", readonly name: string, readonly formals: readonly string[], readonly body: Expr }
export const Rule = (name: string, formals: readonly string[], body: Expr): Rule => ({ $: "Rule", name, formals, body });
export type Alt = { readonly $: "Alt", readonly left: Expr, readonly right: Expr }
export const Alt = (left: Expr, right: Expr): Alt => ({ $: "Alt", left, right });
export type Pure = { readonly $: "Pure", readonly value: string }
export const Pure = (value: string): Pure => ({ $: "Pure", value });
export type Ap = { readonly $: "Ap", readonly left: Expr, readonly right: Expr, readonly mode: Mode }
export const Ap = (left: Expr, right: Expr, mode: Mode): Ap => ({ $: "Ap", left, mode, right });
export type Eps = { readonly $: "Eps" }
export const Eps: Eps = ({ $: "Eps" });
export type Field = { readonly $: "Field", readonly left: Expr, readonly right: Expr, readonly key: string }
export const Field = (key: string, left: Expr, right: Expr): Field => ({ $: "Field", key, left, right });
export type LookNeg = { readonly $: "LookNeg", readonly expr: Expr }
export const LookNeg = (expr: Expr): LookNeg => ({ $: "LookNeg", expr });
export type LookPos = { readonly $: "LookPos", readonly expr: Expr }
export const LookPos = (expr: Expr): LookPos => ({ $: "LookPos", expr });
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
export type Class = { readonly $: "Class", readonly seqs: readonly (Group | ClassChar | SpecialClass | Escape)[], readonly negated: boolean, readonly insensitive: boolean }
export const Class = (seqs: readonly (Group | ClassChar | SpecialClass | Escape)[], negated: boolean, insensitive: boolean): Class => ({ $: "Class", insensitive, negated, seqs });
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
    isPickAllowed: boolean;
    isSpaceAdded: boolean;
    useSkipper: boolean;
}
type Transform<T> = (ctx: Context) => T

export const transform = ({ rules }: g.Grammar): Grammar => {
    const useSkipper = Boolean(rules.find(({ name }) => name === 'space'));
    const spaceOptions = useSkipper ? [false, true] : [false];

    return Grammar(rules.flatMap(({ name, formals, body }) => {
        const isAstRule = name.match(/^[A-Z]/);

        const rules: Rule[] = [];

        for (const isSpaceAdded of spaceOptions) {
            const fullName = !isSpaceAdded && useSkipper ? `${name}$noSkip` : name;
            
            const expr = transformExpr(body)({
                isPickAllowed: !isAstRule,
                isSpaceAdded,
                useSkipper,
            });

            const wrapped = isAstRule ? Field('$', Pure(name), expr) : expr;

            rules.push(Rule(fullName, formals ? [formals.head, ...formals.tail] : [], wrapped));
        }

        return rules;
    }));
};

type gExpr = g.Alt | g.Apply | g.Iter | g.Seq | g.Any | g.Class | g.Terminal

const transformExprs = (nodes: readonly gExpr[]): Transform<Expr[]> => (ctx) => {
    return nodes.map(expr => transformExpr(expr)(ctx));
};

const transformExpr = (node: gExpr): Transform<Expr> => (ctx) => {
    switch (node.$) {
        case 'Apply':
            return Call(
                ctx.useSkipper && !ctx.isSpaceAdded ? `${node.name}$noSkip` : node.name,
                transformExprs(node.params ? [node.params.head, ...node.params.tail] : [])(ctx)
            );
        case 'Iter':
            return transformIter(node)(ctx);
        case 'Seq':
            return transformSeq(node)(ctx);
        case 'Alt':
            const exprs = [node.head, ...node.tail];
            if (exprs.length === 1 && exprs[0]) {
                return transformExpr(exprs[0])(ctx);
            }
            return transformExprs(exprs)(ctx).reduceRight((prev, next) => Alt(next, prev));
        case 'Any':
            return spaced(Any)(ctx);
        case 'Class':
            return spaced(Class(node.seqs, node.negated === '^', node.insensitive === 'i'))(ctx);
        case 'Terminal':
            return spaced(Terminal(node.value))(ctx);
    }
};

const transformIter = ({ prefix, expr, suffix }: g.Iter): Transform<Expr> => {
    return prefix.reduce(
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
            return spaced(expr({
                isPickAllowed: ctx.isPickAllowed,
                isSpaceAdded: false,
                useSkipper: ctx.useSkipper,
            }))(ctx);
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
    const hasPick = exprs.filter(expr => expr.selector?.$ === 'Choose').length;
    const hasNamed = exprs.filter(expr => expr.selector?.$ === 'Name').length;

    if (!ctx.isPickAllowed && hasPick) {
        throw new Error('Cannot pick here');
    }

    if (hasPick && hasNamed) {
        throw new Error('Picking and naming at the same time is not allowed');
    }

    if (hasPick > 1) {
        throw new Error('Pick one');
    }

    const opts = {
        isPickAllowed: true,
        isSpaceAdded: ctx.isSpaceAdded,
        useSkipper: ctx.useSkipper,
    };

    if (hasPick) {
        // ..@..
        // . > (. > (@ < (. < .)))
        const transformed = exprs
            .map(({ expr, selector }) => [
                transformExpr(expr)(opts),
                selector?.$ === 'Choose',
            ] as const);
        return transformed
            .reduceRight(([prev, wasPicked], [expr, willPick]) => [
                Ap(expr, prev, wasPicked ? 'r' : 'l'),
                wasPicked || willPick,
            ])[0];
    }

    if (hasNamed) {
        // ..:.::.
        // . > (. > (: x (. > (: x (: > (. > eps))))))
        const e = exprs
            .map(({ expr, selector }) => [
                transformExpr(expr)(opts),
                selector?.$ === 'Name' ? selector.name : false,
            ] as const);
        e.push([Eps, 'eps']);
        return e
            .reduceRight(([prev, wasPicked], [expr, willPick]) => [
                !wasPicked
                    ? Ap(expr, prev, 'l')
                    : willPick
                        ? Field(willPick, expr, prev)
                        : Ap(expr, prev, 'r'),
                wasPicked || willPick,
            ])[0];
    }

    const e = exprs.map(({ expr }) => transformExpr(expr)(opts));
    e.push(Eps);
    return e.reduceRight((prev, expr) => Ap(expr, prev, 'r'));
};

const spaced = (node: Expr): Transform<Expr> => (ctx) => {
    return ctx.isSpaceAdded ? Ap(node, Star(Call("space$noSkip", [])), 'l') : node;
};