import { Parser } from "./runtime";
export { Parser, Located, alt, any, ap, app, compile, debug, eof, eps, field, left, lex, loc, lookNeg, lookPos, opt, plus, pure, ref, regex, right, rule, sat, seq, star, str, stry, terminal, where, withLoc } from './spaced';
export { Loc, LocEmpty, LocRange } from './located';
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
export declare const parse: <T>(grammar: Parser<T>) => (text: string) => ParseResult<T>;
//# sourceMappingURL=index.d.ts.map