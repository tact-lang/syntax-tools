import * as P from './runtime';
import * as L from './loc';
import { Expectable } from './expectable';

export type Parser<T> = P.Parser<readonly [T, L.Loc]>;

const terminal = <T>(p: P.Parser<T>): Parser<T> => c => {
    const start = c.p;
    const r = p(c);
    if (!r.result.ok) {
        return { result: r.result, exps: r.exps };
    }
    return {
        result: P.success([r.result.value, L.rangeLoc(start, c.p)]),
        exps: r.exps,
    };
};

export const any: Parser<string> = terminal(P.any);

export const range = (from: string, to: string): Parser<string> => {
    return terminal(P.range(from, to));
};

export const str = <K extends string>(s: K): Parser<K> => {
    return terminal(P.str(s));
};

export const regex = <K = string>(s: string, exps: Expectable[]): Parser<K> => {
    return terminal(P.regex(s, exps));
};


export const app = <A, B>(child: Parser<A>, f: (a: A) => B): Parser<B> => {
    return P.app(child, ([v, l]) => [f(v), l])
};

export const seq = <T, U>(left: Parser<T>, right: Parser<U>): Parser<[T, U]> => {
    return P.app(P.seq(left, right), ([[t, l], [u, r]]) => {
        return [[t, u], L.mergeLoc(l, r)];
    });
};

export const alt: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T | U> = P.alt;

export const star = <T,>(child: Parser<T>): Parser<T[]> => {
    return P.app(P.seq(where, P.star(child)), ([[at], ls]) => [
        ls.map(([t]) => t),
        ls.map(([, l]) => l).reduce(L.mergeLoc, L.emptyLoc(at))
    ])
};

export const ref: <A,>(child: () => Parser<A>) => Parser<A> = P.ref;

export const stry = <T,>(child: Parser<T>): Parser<string> => {
    return terminal(P.stry(child));
};

export const lookPos = <T,>(child: Parser<T>): Parser<T> => {
    return P.app(
        P.seq(P.where, P.lookPos(child)),
        ([loc, [t]]) => [t, L.emptyLoc(loc)],
    );
};

export const lookNeg = <T,>(child: Parser<T>): Parser<undefined> => {
    return P.app(
        P.seq(P.where, P.lookNeg(child)),
        ([loc]) => [undefined, L.emptyLoc(loc)],
    );
};

export const named = <T>(name: string, child: Parser<T>): Parser<T> => {
    return P.named(name, child);
};

export const where: Parser<number> = P.app(P.where, (loc) => [loc, L.emptyLoc(loc)]);

export const withLoc = <T,>(child: Parser<T>): Parser<[T, L.Loc]> => {
    return P.app(child, ([t, loc]) => [[t, loc], loc]);
};
