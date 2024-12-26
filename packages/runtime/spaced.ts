import * as B from './runtime';
import * as L from './located';
import { emptyLoc } from './loc';
import { Expectable } from './expectable';

export type Parser<T> = {
    keep: L.Parser<T>;
    skip: (space: L.Parser<unknown>) => L.Parser<T>;
};

const P = <T>(skip: (space: L.Parser<unknown>) => L.Parser<T>, keep: L.Parser<T>): Parser<T> => ({ keep, skip });

export const terminal = <T>(child: L.Parser<T>): Parser<T> => {
    return P(space => B.app(B.seq(child, B.star(space)), ([[t, l]]) => [t, l]), child);
};

export const lift1 = <T, U>(f: (p: L.Parser<T>) => L.Parser<U>) => (child: Parser<T>) => {
    return P(space => f(child.skip(space)), f(child.keep));
};

export const lift2 = <T, U, V>(f: (p: L.Parser<T>, q: L.Parser<U>) => L.Parser<V>) => (l: Parser<T>, r: Parser<U>) => {
    return P(space => f(l.skip(space), r.skip(space)), f(l.keep, r.keep));
};


export const any: Parser<string> = terminal(L.any);

export const str = <K extends string>(s: K): Parser<K> => {
    return terminal(L.str(s));
};

export const range = (from: string, to: string): Parser<string> => {
    return terminal(L.range(from, to));
};

export const regex = <K = string>(s: string, exps: Expectable[]): Parser<K> => {
    return terminal(L.regex(s, exps));
};

export const lex = <T,>(child: Parser<T>): Parser<T> => {
    return terminal(child.keep);
};


export const pure = <const T>(t: T): Parser<T> => {
    const child = L.app(L.where, () => t);
    return P(() => child, child);
};

export const app = <A, B>(child: Parser<A>, f: (a: A) => B): Parser<B> => {
    return P(space => L.app(child.skip(space), f), L.app(child.keep, f));
};

export const seq = lift2(L.seq);

export const alt = lift2(L.alt);

export const star = lift1(L.star);

export const ref = <A,>(child: () => Parser<A>): Parser<A> => {
    let p: null | Parser<A> = null;
    const getP = () => p || (p = child());
    return P(
        space => ctx => getP().skip(space)(ctx),
        ctx => getP().keep(ctx),
    );
};

export const stry = lift1(L.stry);

export const lookPos = lift1(L.lookPos);

export const lookNeg = lift1(L.lookNeg);

export const named = <T>(name: string, child: Parser<T>): Parser<T> => {
    return P(space => L.named(name, child.skip(space)), L.named(name, child.keep));
};

export const where: Parser<number> = P(() => L.where, L.where);

export const withLoc = lift1(L.withLoc);
