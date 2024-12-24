import * as P from './runtime';

export type Parser<T> = P.Parser<[T, Loc]>;

export type Loc = LocRange | LocEmpty
export type LocRange = { readonly $: 'range', readonly start: number, readonly end: number };
const range = (start: number, end: number): LocRange => ({ $: 'range', start, end });
export type LocEmpty = { readonly $: 'empty', readonly at: number }
const empty = (at: number): LocEmpty => ({ $: 'empty', at });
const isEmpty = (loc: Loc): loc is LocEmpty => loc.$ === 'empty';

const span = (left: Loc, right: Loc): Loc => {
    return isEmpty(left) ? right : isEmpty(right) ? left : range(left.start, right.end);
};

const terminal = <T>(p: P.Parser<T>): Parser<T> => c => {
    const start = c.p;
    const r = p(c);
    if (P.isFailure(r)) return P.failure;
    return P.success([P.getSuccess(r), range(start, c.p)]);
};

export const rule = <T>(child: Parser<T>): Parser<T> => (ctx) => {
    const result = child(ctx);
    return result;
};

export const pure = <const T>(t: T): Parser<T> => terminal(P.pure(t));

export const ap = <T, U>(left: Parser<(t: T) => U>, right: Parser<T>): Parser<U> => {
    return P.app(P.seq(left, right), ([[f, l], [x, r]]) => [f(x), span(l, r)]);
};

export const left = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T> => {
    return P.app(P.seq(left, right), ([[t, l], [, r]]) => [t, span(l, r)]);
};

export const right = <T, U>(left: Parser<T>, right: Parser<U>): Parser<U> => {
    return P.app(P.seq(left, right), ([[, l], [u, r]]) => [u, span(l, r)]);
};

export const seq = <T, U>(left: Parser<T>, right: Parser<U>): Parser<[T, U]> => {
    return P.app(P.seq(left, right), ([[t, l], [u, r]]) => [[t, u], span(l, r)]);
};

export const field = <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>): Parser<Record<K, T> & V> => {
    return ap(app(left, (l: T) => (r: V) => ({ ...P.singleton(key, l), ...r })), right);
};

export const alt = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T | U> => {
    return P.alt(left, right);
};

export const str = <K extends string>(s: K): Parser<K> => {
    return terminal(P.str(s));
};

export const sat = (cond: (c: string) => boolean, message: string): Parser<string> => {
    return terminal(P.sat(cond, message));
};

export const regex = <K = string>(s: string, insensitive: boolean = false): Parser<K> => {
    return terminal(P.regex(s, insensitive));
};

export const stry = <T,>(child: Parser<T>): Parser<string> => {
    return terminal(P.stry(child));
};

export const app = <A, B>(child: Parser<A>, f: (a: A) => B): Parser<B> => {
    return P.app(child, ([v, l]) => [f(v), l])
};

export const ref = <A,>(child: () => Parser<A>): Parser<A> => {
    return P.ref(child);
};

export const star = <T,>(child: Parser<T>): Parser<T[]> => {
    return P.app(P.seq(where, P.star(child)), ([[at], ls]) => [
        ls.map(([t]) => t),
        ls.map(([, l]) => l).reduce(span, empty(at))
    ])
};

export const any: Parser<string> = terminal(P.any);

export const eps: Parser<{}> = terminal(P.eps);

export const fail: Parser<never> = P.fail;

export const plus = <T,>(child: Parser<T>): Parser<T[]> => {
    return app(
        seq(child, star(child)),
        ([a, as]) => (as.unshift(a), as)
    );
};

export const opt = <T,>(child: Parser<T>): Parser<T | undefined> => {
    return alt(child, app(eps, () => undefined))
};

export const lookPos: <T,>(child: Parser<T>) => Parser<T> = P.lookPos;

export const lookNeg = <T,>(child: Parser<T>): Parser<undefined> => {
    const p = lookPos(child);

    return ctx => {
        const r = p(ctx);
        return P.isSuccess(r) ? P.failure : P.success([undefined, empty(ctx.p)]);
    };
};

export const eof: Parser<undefined> = lookNeg(any);

export const debug: <T,>(child: Parser<T>) => Parser<T> = P.debug;

export const where: Parser<number> = ctx => P.success([ctx.p, empty(ctx.p)]);

export const withLoc = <T,>(child: Parser<T>): Parser<[T, Loc]> => {
    return P.app(child, ([t, loc]) => [[t, loc], loc]);
};
