export type Success<T> = [T];
export declare const success: <T>(t: T) => Success<T>;
export declare const getSuccess: <T>(t: Success<T>) => T;
export declare const isSuccess: <T>(t: Result<T>) => t is Success<T>;
export type Failure = null;
export declare const failure: Failure;
export declare const isFailure: <T>(t: Result<T>) => t is Failure;
export type Result<T> = Success<T> | Failure;
declare const createContext: (s: string) => {
    s: string;
    p: number;
    l: number;
    assert: <T>(cond: boolean, message: string, len: number, result: T) => Result<T>;
    getError: () => {
        position: number;
        expected: Set<string>;
    };
};
type Context = ReturnType<typeof createContext>;
export type Parser<T> = (ctx: Context) => Result<T>;
export type GetResult<T> = T extends Parser<infer T> ? T : never;
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
export declare const parse: <T>(parser: Parser<T>, code: string) => ParseResult<T>;
export declare const rule: <T>(child: Parser<T>) => Parser<T>;
export declare const pure: <const T>(t: T) => Parser<T>;
export declare const ap: <T, U>(left: Parser<(t: T) => U>, right: Parser<T>) => Parser<U>;
export declare const pa: <T, U>(left: Parser<T>, right: Parser<(t: T) => U>) => Parser<U>;
export declare const left: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T>;
export declare const right: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<U>;
type Seq<R extends any[]> = {
    end: Parser<R>;
    add: <T>(child: Parser<T>) => Seq<[...R, T]>;
};
export declare const seq: Seq<[]>;
export declare const singleton: <K extends string, V>(key: K, value: V) => Record<K, V>;
export declare const field: <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>) => Parser<Record<K, T> & V>;
type NameRec<R> = {
    end: Parser<R>;
    add: <K extends string, T>(key: K, child: Parser<T>) => NameRec<R & Record<K, T>>;
};
export declare const name: NameRec<{}>;
export declare const alt: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T | U>;
type Sel<R> = {
    end: Parser<R>;
    add: <T>(child: Parser<T>) => Sel<R | T>;
};
export declare const sel: Sel<never>;
export declare const str: <K extends string>(s: K) => Parser<K>;
export declare const sat: (cond: (c: string) => boolean, message: string) => Parser<string>;
export declare const regex: <K = string>(s: string, insensitive?: boolean) => Parser<K>;
export declare const stry: <T>(child: Parser<T>) => Parser<string>;
export declare const app: <A, B>(child: Parser<A>, f: (a: A) => B) => Parser<B>;
export declare const ref: <A>(child: () => Parser<A>) => Parser<A>;
export declare const star: <T>(child: Parser<T>) => Parser<T[]>;
export declare const any: Parser<string>;
export declare const EPS: Readonly<{}>;
export declare const eps: Parser<{}>;
export declare const plus: <T>(child: Parser<T>) => Parser<T[]>;
export declare const opt: <T>(child: Parser<T>) => Parser<T | undefined>;
export declare const lookPos: <T>(child: Parser<T>) => Parser<T>;
export declare const lookNeg: <T>(child: Parser<T>) => Parser<undefined>;
export declare const eof: Parser<undefined>;
export declare const where: Parser<number>;
export declare const debug: <T>(child: Parser<T>) => Parser<T>;
export declare const infix: <A, B>(a: Parser<A>, b: Parser<B>) => Parser<[A, [B, A][]]>;
export declare const infixl: <A>(a: Parser<A>, b: Parser<(l: A, r: A) => A>) => Parser<A>;
export declare const infixr: <A>(a: Parser<A>, b: Parser<(l: A, r: A) => A>) => Parser<A>;
export declare const prefix: <A>(a: Parser<A>, b: Parser<(a: A) => A>) => Parser<A>;
export declare const suffix: <A>(a: Parser<A>, b: Parser<(a: A) => A>) => Parser<A>;
export type Location = readonly [from: number, to: number];
export type Located<T> = T & {
    readonly loc: Location;
};
export declare const loc: <T>(child: Parser<T>) => Parser<Located<T>>;
export {};
//# sourceMappingURL=runtime.d.ts.map