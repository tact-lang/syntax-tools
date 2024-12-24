import * as P from './runtime';
export type Parser<T> = P.Parser<[T, Loc]>;
export type Loc = LocRange | LocEmpty;
export type LocRange = {
    readonly $: 'range';
    readonly start: number;
    readonly end: number;
};
export type LocEmpty = {
    readonly $: 'empty';
    readonly at: number;
};
export declare const rule: <T>(child: Parser<T>) => Parser<T>;
export declare const pure: <const T>(t: T) => Parser<T>;
export declare const ap: <T, U>(left: Parser<(t: T) => U>, right: Parser<T>) => Parser<U>;
export declare const left: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T>;
export declare const right: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<U>;
export declare const seq: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<[T, U]>;
export declare const field: <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>) => Parser<Record<K, T> & V>;
export declare const alt: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T | U>;
export declare const str: <K extends string>(s: K) => Parser<K>;
export declare const sat: (cond: (c: string) => boolean, message: string) => Parser<string>;
export declare const regex: <K = string>(s: string, insensitive?: boolean) => Parser<K>;
export declare const stry: <T>(child: Parser<T>) => Parser<string>;
export declare const app: <A, B>(child: Parser<A>, f: (a: A) => B) => Parser<B>;
export declare const ref: <A>(child: () => Parser<A>) => Parser<A>;
export declare const star: <T>(child: Parser<T>) => Parser<T[]>;
export declare const any: Parser<string>;
export declare const eps: Parser<{}>;
export declare const fail: Parser<never>;
export declare const plus: <T>(child: Parser<T>) => Parser<T[]>;
export declare const opt: <T>(child: Parser<T>) => Parser<T | undefined>;
export declare const lookPos: <T>(child: Parser<T>) => Parser<T>;
export declare const lookNeg: <T>(child: Parser<T>) => Parser<undefined>;
export declare const eof: Parser<undefined>;
export declare const debug: <T>(child: Parser<T>) => Parser<T>;
export declare const where: Parser<number>;
export declare const withLoc: <T>(child: Parser<T>) => Parser<[T, Loc]>;
//# sourceMappingURL=located.d.ts.map