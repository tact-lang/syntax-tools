import * as P from './runtime';
import * as L from './loc';

export type Parser<T> = P.Parser<readonly [T, L.Loc]>;

const terminal = <T>(p: P.Parser<T>): Parser<T> => c => {
    const start = c.p;
    const r = p(c);
    if (P.isFailure(r)) return P.failure;
    return P.success([P.getSuccess(r), L.rangeLoc(start, c.p)]);
};

export const rule = <T>(child: Parser<T>): Parser<T> => (ctx) => {
    const result = child(ctx);
    return result;
};

export const pure = <const T>(t: T): Parser<T> => ctx => {
    return P.app(P.pure(t), t => [t, L.emptyLoc(ctx.p)] as const)(ctx);
};

export const ap = <T, U>(left: Parser<(t: T) => U>, right: Parser<T>): Parser<U> => {
    return P.app(P.seq(left, right), ([[f, l], [x, r]]) => [f(x), L.mergeLoc(l, r)]);
};

export const left = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T> => {
    return P.app(P.seq(left, right), ([[t, l], [, r]]) => [t, L.mergeLoc(l, r)]);
};

export const right = <T, U>(left: Parser<T>, right: Parser<U>): Parser<U> => {
    return P.app(P.seq(left, right), ([[, l], [u, r]]) => [u, L.mergeLoc(l, r)]);
};

export const seq = <T, U>(left: Parser<T>, right: Parser<U>): Parser<[T, U]> => {
    return P.app(P.seq(left, right), ([[t, l], [u, r]]) => [[t, u], L.mergeLoc(l, r)]);
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
        ls.map(([, l]) => l).reduce(L.mergeLoc, L.emptyLoc(at))
    ])
};

export const any: Parser<string> = terminal(P.any);

export const eps: Parser<{}> = (ctx) => P.success([P.EPS, L.emptyLoc(ctx.p)]);

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

export const lookPos = <T,>(child: Parser<T>): Parser<T> => {
    const p = P.lookPos(child);

    return ctx => {
        return P.app(p, ([t]) => [t, L.emptyLoc(ctx.p)] as const)(ctx);
    };
};

export const lookNeg = <T,>(child: Parser<T>): Parser<undefined> => {
    const p = lookPos(child);

    return ctx => {
        const r = p(ctx);
        return P.isSuccess(r) ? P.failure : P.success([undefined, L.emptyLoc(ctx.p)]);
    };
};

export const eof: Parser<undefined> = lookNeg(any);

export const debug: <T,>(child: Parser<T>) => Parser<T> = P.debug;

export const where: Parser<number> = ctx => P.success([ctx.p, L.emptyLoc(ctx.p)]);

export const withLoc = <T,>(child: Parser<T>): Parser<[T, L.Loc]> => {
    return P.app(child, ([t, loc]) => [[t, loc], loc]);
};
