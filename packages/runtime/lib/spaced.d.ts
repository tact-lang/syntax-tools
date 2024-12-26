import * as L from './located';
import { Expectable } from './expectable';
export type Parser<T> = {
    keep: L.Parser<T>;
    skip: (space: L.Parser<unknown>) => L.Parser<T>;
};
export declare const terminal: <T>(child: L.Parser<T>) => Parser<T>;
export declare const lift1: <T, U>(f: (p: L.Parser<T>) => L.Parser<U>) => (child: Parser<T>) => Parser<U>;
export declare const lift2: <T, U, V>(f: (p: L.Parser<T>, q: L.Parser<U>) => L.Parser<V>) => (l: Parser<T>, r: Parser<U>) => Parser<V>;
export declare const any: Parser<string>;
export declare const str: <K extends string>(s: K) => Parser<K>;
export declare const range: (from: string, to: string) => Parser<string>;
export declare const regex: <K = string>(s: string, exps: Expectable[]) => Parser<K>;
export declare const lex: <T>(child: Parser<T>) => Parser<T>;
export declare const pure: <const T>(t: T) => Parser<T>;
export declare const app: <A, B>(child: Parser<A>, f: (a: A) => B) => Parser<B>;
export declare const seq: <T, U>(l: Parser<T>, r: Parser<U>) => Parser<[T, U]>;
export declare const alt: <T, U>(l: Parser<T>, r: Parser<U>) => Parser<T | U>;
export declare const star: <T>(child: Parser<T>) => Parser<T[]>;
export declare const ref: <A>(child: () => Parser<A>) => Parser<A>;
export declare const stry: <T>(child: Parser<T>) => Parser<string>;
export declare const lookPos: <T>(child: Parser<T>) => Parser<T>;
export declare const lookNeg: <T>(child: Parser<T>) => Parser<undefined>;
export declare const named: <T>(name: string, child: Parser<T>) => Parser<T>;
export declare const where: Parser<number>;
export declare const withLoc: <T>(child: Parser<T>) => Parser<[T, import("./loc").Loc]>;
//# sourceMappingURL=spaced.d.ts.map