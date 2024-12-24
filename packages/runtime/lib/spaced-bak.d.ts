import * as B from './runtime';
import * as L from './located';
export type Parser<T> = {
    keep: L.Parser<T>;
    skip: L.Parser<T>;
};
export type Located<T> = T & {
    readonly loc: L.Loc;
};
export declare const getAlgebra: (space: L.Parser<unknown>) => {
    rule: <T>(child: Parser<T>) => Parser<T>;
    pure: <const T>(t: T) => Parser<T>;
    ap: <T, U>(left: Parser<(t: T) => U>, right: Parser<T>) => Parser<U>;
    left: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T>;
    right: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<U>;
    seq: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<[T, U]>;
    field: <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>) => Parser<Record<K, T> & V>;
    alt: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T | U>;
    str: <K extends string>(s: K) => Parser<K>;
    sat: (cond: (c: string) => boolean, message: string) => Parser<string>;
    regex: <K = string>(s: string, insensitive?: boolean) => Parser<K>;
    stry: <T>(child: Parser<T>) => Parser<string>;
    app: <A, B>(child: Parser<A>, f: (a: A) => B) => Parser<B>;
    ref: <A>(child: () => Parser<A>) => Parser<A>;
    star: <T>(child: Parser<T>) => Parser<T[]>;
    any: Parser<string>;
    eps: Parser<{}>;
    plus: <T>(child: Parser<T>) => Parser<T[]>;
    opt: <T>(child: Parser<T>) => Parser<T | undefined>;
    lookPos: <T>(child: Parser<T>) => Parser<T>;
    lookNeg: <T>(child: Parser<T>) => Parser<undefined>;
    eof: Parser<undefined>;
    debug: <T>(child: Parser<T>) => Parser<T>;
    where: Parser<number>;
    withLoc: <T>(child: Parser<T>) => Parser<[T, L.Loc]>;
    loc: <T>(child: Parser<T>) => Parser<Located<T>>;
    lex: <T>(child: Parser<T>) => Parser<T>;
    compile: <T>(child: Parser<T>, space: () => Parser<unknown>) => B.Parser<T>;
};
export type Algebra = ReturnType<typeof getAlgebra>;
//# sourceMappingURL=spaced-bak.d.ts.map