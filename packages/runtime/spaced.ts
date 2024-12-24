import * as B from './runtime';
import * as L from './located';

export type Parser<T> = {
    keep: L.Parser<T>;
    skip: (space: L.Parser<unknown>) => L.Parser<T>;
};

const P = <T>(skip: (space: L.Parser<unknown>) => L.Parser<T>, keep: L.Parser<T>): Parser<T> => ({ keep, skip });

export type Located<T> = T & { readonly loc: L.Loc }

export const terminal = <T>(child: L.Parser<T>): Parser<T> => {
    return P(space => B.app(B.seq(child, B.star(space)), ([[t, l]]) => [t, l]), child);
};

export const rule = <T>(child: Parser<T>): Parser<T> => {
    return P(space => L.rule(child.skip(space)), L.rule(child.keep));
};

export const pure = <const T>(t: T): Parser<T> => {
    const child = L.pure(t)
    return P(() => child, child);
};

export const ap = <T, U>(left: Parser<(t: T) => U>, right: Parser<T>): Parser<U> => {
    return P(space => L.ap(left.skip(space), right.skip(space)), L.ap(left.keep, right.keep));
};

export const left = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T> => {
    return P(space => L.left(left.skip(space), right.skip(space)), L.left(left.keep, right.keep));
};

export const right = <T, U>(left: Parser<T>, right: Parser<U>): Parser<U> => {
    return P(space => L.right(left.skip(space), right.skip(space)), L.right(left.keep, right.keep));
};

export const seq = <T, U>(left: Parser<T>, right: Parser<U>): Parser<[T, U]> => {
    return P(space => L.seq(left.skip(space), right.skip(space)), L.seq(left.keep, right.keep));
};

export const field = <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>): Parser<Record<K, T> & V> => {
    return P(space => L.field(left.skip(space), key, right.skip(space)), L.field(left.keep, key, right.keep));
};

export const alt = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T | U> => {
    return P(space => L.alt(left.skip(space), right.skip(space)), L.alt(left.keep, right.keep));
};

export const str = <K extends string>(s: K): Parser<K> => {
    return terminal(L.str(s));
};

export const sat = (cond: (c: string) => boolean, message: string): Parser<string> => {
    return terminal(L.sat(cond, message));
};

export const regex = <K = string>(s: string, insensitive: boolean = false): Parser<K> => {
    return terminal(L.regex(s, insensitive));
};

export const stry = <T,>(child: Parser<T>): Parser<string> => {
    return P(space => L.stry(child.skip(space)), L.stry(child.keep));
};

export const app = <A, B>(child: Parser<A>, f: (a: A) => B): Parser<B> => {
    return P(space => L.app(child.skip(space), f), L.app(child.keep, f));
};

export const ref = <A,>(child: () => Parser<A>): Parser<A> => {
    let p: null | Parser<A> = null;
    return P(
        space => ctx => (p || (p = child())).skip(space)(ctx),
        ctx => (p || (p = child())).keep(ctx),
    );
};

export const star = <T,>(child: Parser<T>): Parser<T[]> => {
    return P(space => L.star(child.skip(space)), L.star(child.keep));
};

export const any: Parser<string> = terminal(L.any);

export const eps: Parser<{}> = terminal(L.eps);

export const plus = <T,>(child: Parser<T>): Parser<T[]> => {
    return P(space => L.plus(child.skip(space)), L.plus(child.keep));
};

export const opt = <T,>(child: Parser<T>): Parser<T | undefined> => {
    return P(space => L.opt(child.skip(space)), L.opt(child.keep));
};

export const lookPos = <T,>(child: Parser<T>): Parser<T> => {
    return P(space => L.lookPos(child.skip(space)), L.lookPos(child.keep));
};

export const lookNeg = <T,>(child: Parser<T>): Parser<undefined> => {
    return P(space => L.lookNeg(child.skip(space)), L.lookNeg(child.keep));
};

export const eof: Parser<undefined> = P(() => L.eof, L.eof);

export const debug = <T,>(child: Parser<T>): Parser<T> => {
    return P(space => L.debug(child.skip(space)), L.debug(child.keep));
};

export const where: Parser<number> = P(() => L.where, L.where);

export const withLoc = <T,>(child: Parser<T>): Parser<[T, L.Loc]> => {
    return P(space => L.withLoc(child.skip(space)), L.withLoc(child.keep));
};

export const loc = <T,>(child: Parser<T>): Parser<Located<T>> => {
    return app(withLoc(child), ([t, loc]) => ({ ...t, loc }));
};

export const lex = <T,>(child: Parser<T>): Parser<T> => {
    return terminal(child.keep);
};

export const compile = <T,>(child: Parser<T>, space: Parser<unknown>) => {
    return B.app(right(star(space), left(child, eof)).skip(space.keep), ([t]) => t);
};
