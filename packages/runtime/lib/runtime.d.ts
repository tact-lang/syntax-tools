import * as E from "./expectable";
export type Success<T> = {
    readonly ok: true;
    readonly value: T;
};
export declare const success: <T>(value: T) => Success<T>;
export declare const getSuccess: <T>(t: Success<T>) => T;
export type Failure = {
    readonly ok: false;
};
export declare const failure: () => Failure;
export type Result<T> = Success<T> | Failure;
export declare const createContext: (s: string) => {
    s: string;
    p: number;
    l: number;
    ignoreErrors: boolean;
};
export type Context = ReturnType<typeof createContext>;
export type Parser<T> = (ctx: Context) => {
    result: Result<T>;
    exps: E.ExpSet;
};
export type GetResult<T> = T extends Parser<infer T> ? T : never;
export declare const terminal: <T>(kind: E.Expectable, child: (ctx: Context) => Result<T>) => Parser<T>;
export declare const any: Parser<string>;
export declare const range: (from: string, to: string) => Parser<string>;
export declare const regex: <K = string>(s: string, exps: E.Expectable[]) => Parser<K>;
export declare const str: <K extends string>(s: K) => Parser<K>;
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
//# sourceMappingURL=runtime.d.ts.map