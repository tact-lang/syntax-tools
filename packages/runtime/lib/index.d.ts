import { Loc } from './loc';
import * as B from './runtime';
import * as S from './spaced';
export { Parser, alt, any, app, lex, lookNeg, lookPos, named, pure, ref, regex, seq, star, str, stry, terminal, where, withLoc } from './spaced';
export * from './loc';
export * from './expectable';
export type ParseResult<T> = ParseResultSuccess<T> | ParseResultError;
export type ParseResultError = {
    readonly $: "error";
    readonly error: {
        readonly position: number;
        readonly expected: ReadonlySet<string>;
    };
};
export type ParseResultSuccess<T> = {
    readonly $: "success";
    readonly value: T;
};
export declare const left: <T, U>(left: S.Parser<T>, right: S.Parser<U>) => S.Parser<T>;
export declare const right: <T, U>(left: S.Parser<T>, right: S.Parser<U>) => S.Parser<U>;
export declare const field: <T, K extends string, V>(left: S.Parser<T>, key: K, right: S.Parser<V>) => S.Parser<Record<K, T> & V>;
export declare const plus: <T>(child: S.Parser<T>) => S.Parser<T[]>;
export declare const EPS: Readonly<{}>;
export declare const eps: S.Parser<{}>;
export declare const opt: <T>(child: S.Parser<T>) => S.Parser<T | undefined>;
export declare const eof: S.Parser<undefined>;
export type Located<T> = T & {
    readonly loc: Loc;
};
export declare const loc: <T>(child: S.Parser<T>) => S.Parser<Located<T>>;
export declare const compile: <T>(child: S.Parser<T>, space: S.Parser<unknown>) => B.Parser<T>;
export declare const parse: <T>(grammar: B.Parser<T>) => (text: string) => ParseResult<T>;
//# sourceMappingURL=index.d.ts.map