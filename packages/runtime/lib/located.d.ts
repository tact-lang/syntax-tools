import * as P from './runtime';
import * as L from './loc';
import { Expectable } from './expectable';
export type Parser<T> = P.Parser<readonly [T, L.Loc]>;
export declare const any: Parser<string>;
export declare const range: (from: string, to: string) => Parser<string>;
export declare const str: <K extends string>(s: K) => Parser<K>;
export declare const regex: <K = string>(s: string, exps: Expectable[], insensitive?: boolean) => Parser<K>;
export declare const app: <A, B>(child: Parser<A>, f: (a: A) => B) => Parser<B>;
export declare const seq: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<[T, U]>;
export declare const alt: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T | U>;
export declare const star: <T>(child: Parser<T>) => Parser<T[]>;
export declare const ref: <A>(child: () => Parser<A>) => Parser<A>;
export declare const stry: <T>(child: Parser<T>) => Parser<string>;
export declare const lookPos: <T>(child: Parser<T>) => Parser<T>;
export declare const lookNeg: <T>(child: Parser<T>) => Parser<undefined>;
export declare const named: <T>(name: string, child: Parser<T>) => Parser<T>;
export declare const where: Parser<number>;
export declare const withLoc: <T>(child: Parser<T>) => Parser<[T, L.Loc]>;
//# sourceMappingURL=located.d.ts.map