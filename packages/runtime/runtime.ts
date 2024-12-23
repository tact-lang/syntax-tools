export type Success<T> = [T]
export const success = <T>(t: T): Success<T> => [t];
export const getSuccess = <T>(t: Success<T>): T => t[0];
export const isSuccess = <T>(t: Result<T>): t is Success<T> => Boolean(t);

export type Failure = null
export const failure: Failure = null;
export const isFailure = <T>(t: Result<T>): t is Failure => !t;

export type Result<T> = Success<T> | Failure

const createContext = (s: string) => {
    let failPos = 0;
    let messages = new Set<string>();
    const assert = <T,>(cond: boolean, message: string, len: number, result: T): Result<T> => {
        if (cond) {
            ctx.p += len;
            return success(result);
        }
        if (ctx.p > failPos) {
            failPos = ctx.p;
            messages = new Set();
        }
        if (ctx.p === failPos) {
            messages.add(message);
        }
        return failure;
    };
    const getError = () => ({
        position: failPos,
        expected: messages,
    });
    const ctx = {
        s,
        p: 0,
        l: s.length,
        assert,
        getError,
    };
    return ctx;
};

type Context = ReturnType<typeof createContext>;

export type Parser<T> = (ctx: Context) => Result<T>;
export type GetResult<T> = T extends Parser<infer T> ? T : never;

export type ParseResult<T> = ParseResultSuccess<T> | ParseResultError
export type ParseResultError = {
    readonly $: "error";
    readonly error: {
        readonly position: number;
        readonly expected: ReadonlySet<string>;
    };
}
export type ParseResultSuccess<T> = {
    readonly $: "success";
    readonly value: T;
}

export const parse = <T,>(parser: Parser<T>, code: string): ParseResult<T> => {
    const c = createContext(code);
    const r = parser(c);
    if (isFailure(r)) {
        return { $: 'error', error: c.getError() } as const;
    } else {
        return { $: 'success', value: getSuccess(r) } as const;
    }
};

export const rule = <T>(child: Parser<T>): Parser<T> => (ctx) => {
    const result = child(ctx);
    return result;
};

type Either<L, R> = Left<L> | Right<R>
type Left<L> = { $: 'left', value: L }
type Right<R> = { $: 'right', value: R }

interface P1 {
    pure: <const T>(t: T) => Parser<T>;
    where: Parser<number>;
    any: Parser<string>;
    str: <K extends string>(s: K) => Parser<K>;
    regex: <K = string>(s: string, insensitive?: boolean) => Parser<K>;

    ref: <A,>(child: () => Parser<A>) => Parser<A>;
    ap: <T, U>(left: Parser<(t: T) => U>, right: Parser<T>) => Parser<U>;
    ch: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<Either<T, U>>;
    lookPos: <T,>(child: Parser<T>) => Parser<T>;
}

interface P3 extends P1 {
    star: <T,>(child: Parser<T>) => Parser<T[]>;
    alt: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T | U>;
    field: <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>) => Parser<Record<K, T> & V>;
    stry: <T,>(child: Parser<T>) => Parser<string>;
    left: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T>;
    right: <T, U>(left: Parser<T>, right: Parser<U>) => Parser<T>;
    eps: Parser<{}>;
    opt: <T,>(child: Parser<T>) => Parser<T | undefined>;
    plus: <T,>(child: Parser<T>) => Parser<T[]>;
    lookNeg: <T,>(child: Parser<T>) => Parser<undefined>;
}

export const pure = <const T>(t: T): Parser<T> => () => success(t);

export const ap = <T, U>(left: Parser<(t: T) => U>, right: Parser<T>): Parser<U> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return success(getSuccess(l)(getSuccess(r)));
};

export const left = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return l;
};

export const right = <T, U>(left: Parser<T>, right: Parser<U>): Parser<U> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return r;
};

export const seq = <T, U>(left: Parser<T>, right: Parser<U>): Parser<[T, U]> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return success([getSuccess(l), getSuccess(r)]);
};

// TS bug
export const singleton = <K extends string, V>(key: K, value: V): Record<K, V> => ({ [key]: value }) as Record<K, V>;

export const field = <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>): Parser<Record<K, T> & V> => {
    return ap(app(left, (l: T) => (r: V) => ({ ...singleton(key, l), ...r })), right);
};

export const alt = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T | U> => (ctx) => {
    const p = ctx.p;
    const l = left(ctx);
    if (isSuccess(l)) return l;
    ctx.p = p;
    return right(ctx);
};

export const str = <K extends string>(s: K): Parser<K> => {
    const message = JSON.stringify(s);
    return ctx => ctx.assert(ctx.s.substring(ctx.p, ctx.p + s.length) === s, message, s.length, s);
};

export const sat = (cond: (c: string) => boolean, message: string): Parser<string> => ctx => {
    const c = ctx.s[ctx.p]!;
    return ctx.assert(ctx.p < ctx.l && cond(c), message, 1, c);
};

export const regex = <K = string>(s: string, insensitive: boolean = false): Parser<K> => {
    const r = new RegExp(`^[${s}]$`, insensitive ? "i" : undefined);
    return sat(c => r.test(c), `[${s}]`) as Parser<K>;
};

export const stry = <T,>(child: Parser<T>): Parser<string> => ctx => {
    const p = ctx.p;
    return child(ctx) ? success(ctx.s.substring(p, ctx.p)) : failure;
};

export const app = <A, B>(child: Parser<A>, f: (a: A) => B): Parser<B> => ctx => {
    const r = child(ctx);
    return isSuccess(r) ? success(f(getSuccess(r))) : failure;
};

export const ref = <A,>(child: () => Parser<A>): Parser<A> => {
    let p: null | Parser<A> = null;
    return ctx => (p || (p = child()))(ctx);
};

export const star = <T,>(child: Parser<T>): Parser<T[]> => ctx => {
    const result: T[] = [];
    let p = ctx.p;
    for (;;) {
        p = ctx.p;
        const r = child(ctx);
        if (isFailure(r)) {
            ctx.p = p;
            return success(result);
        }
        result.push(getSuccess(r));
    }
};

export const any: Parser<string> = sat(() => true, 'any character');

export const EPS = Object.freeze({});
export const eps: Parser<{}> = () => success(EPS);

export const plus = <T,>(child: Parser<T>): Parser<T[]> => {
    return app(
        seq(child, star(child)),
        ([a, as]) => (as.unshift(a), as)
    );
};

export const opt = <T,>(child: Parser<T>): Parser<T | undefined> => {
    return alt(child, app(eps, () => undefined))
};

export const lookPos = <T,>(child: Parser<T>): Parser<T> => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    ctx.p = p;
    return r;
};

export const lookNeg = <T,>(child: Parser<T>): Parser<undefined> => {
    const p = lookPos(child);
    return ctx => isSuccess(p(ctx)) ? failure : success(undefined);
};

export const eof: Parser<undefined> = lookNeg(any);

export const debug = <T,>(child: Parser<T>): Parser<T> => ctx => {
    const before = ctx.p;
    debugger;
    const r = child(ctx);
    console.log(before, ctx.p, r);
    return r;
};

export type Location = readonly [from: number, to: number]
export type Located<T> = T & { readonly loc: Location }

export const where: Parser<number> = ctx => success(ctx.p);

export const loc = <T,>(child: Parser<T>): Parser<Located<T>> => {
    return app(
        seq(seq(where, child), where),
        ([[start, child], end]) => ({ ... child, loc: [start, end] })
    );
};
