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
    const getError = () => {
        const prev = ctx.s.substring(0, failPos).split('\n');
        const row = prev.length;
        const begin = prev[prev.length - 1]!;
        const col = begin.length;
        const context = begin + "\n" +
            new Array(begin.length + 1).fill('').join('.') +
            ctx.s.split('\n')[row - 1]!.substring(begin.length);
        return `${row}:${col}: got ${JSON.stringify(ctx.s[failPos])}, expected ${[...messages].join(', ')}\n${context}`;
    };
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

export class ParseError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export const parse = <T,>(parser: Parser<T>, code: string): T => {
    const c = createContext(code);
    const r = parser(c);
    if (isFailure(r)) {
        throw new ParseError(c.getError());
    }
    return getSuccess(r);
};

export const rule = <T>(child: Parser<T>): Parser<T> => (ctx) => {
    const result = child(ctx);
    return result;
};

export const pure = <const T>(t: T): Parser<T> => () => success(t);

export const ap = <T, U>(left: Parser<(t: T) => U>, right: Parser<T>): Parser<U> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return success(getSuccess(l)(getSuccess(r)));
};

export const pa = <T, U>(left: Parser<T>, right: Parser<(t: T) => U>): Parser<U> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return success(getSuccess(r)(getSuccess(l)));
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

const seq2 = <T extends any[], U>(left: Parser<T>, right: Parser<U>): Parser<[...T, U]> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return success([...getSuccess(l), getSuccess(r)]);
};
type Seq<R extends any[]> = {
    end: Parser<R>;
    add: <T>(child: Parser<T>) => Seq<[...R, T]>;
}
const seqRec = <R extends any[]>(end: Parser<R>): Seq<R> => ({
    end,
    add: child => seqRec(seq2(end, child)),
});
export const seq = seqRec<[]>(() => success([]));

// TS bug
export const singleton = <K extends string, V>(key: K, value: V): Record<K, V> => ({ [key]: value }) as Record<K, V>;

export const field = <T, K extends string, V>(left: Parser<T>, key: K, right: Parser<V>): Parser<Record<K, T> & V> => {
    return ap(app(left, (l: T) => (r: V) => ({ ...singleton(key, l), ...r })), right);
};

const name2 = <T, K extends string, U>(left: Parser<T>, key: K, right: Parser<U>): Parser<T & Record<K, U>> => ctx => {
    const l = left(ctx);
    if (isFailure(l)) return failure;
    const r = right(ctx);
    if (isFailure(r)) return failure;
    return success({ ...getSuccess(l), ...singleton(key, getSuccess(r)) });
};
type NameRec<R> = {
    end: Parser<R>;
    add: <K extends string, T>(key: K, child: Parser<T>) => NameRec<R & Record<K, T>>;
}
const nameRec = <R>(end: Parser<R>): NameRec<R> => ({
    end,
    add: <K extends string, T>(key: K, child: Parser<T>) => nameRec(name2(end, key, child)),
});
export const name = nameRec<{}>(() => success({}));

export const alt = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T | U> => (ctx) => {
    const p = ctx.p;
    const l = left(ctx);
    if (isSuccess(l)) return l;
    ctx.p = p;
    return right(ctx);
};
type Sel<R> = {
    end: Parser<R>;
    add: <T>(child: Parser<T>) => Sel<R | T>;
}
const selRec = <R>(end: Parser<R>): Sel<R> => ({
    end,
    add: child => selRec(alt(end, child)),
});
export const sel = selRec<never>(() => failure);

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

export const plus = <T,>(child: Parser<T>): Parser<T[]> => app(seq.add(child).add(star(child)).end, ([a, as]) => (as.unshift(a), as));

export const opt = <T,>(child: Parser<T>): Parser<T | undefined> => alt(child, app(eps, () => undefined));

export const lookPos = <T,>(child: Parser<T>): Parser<undefined> => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    ctx.p = p;
    return r ? success(undefined) : failure;
};

export const lookNeg = <T,>(child: Parser<T>): Parser<undefined> => {
    const p = lookPos(child);
    return ctx => isSuccess(p(ctx)) ? failure : success(undefined);
};

export const eof: Parser<undefined> = lookNeg(any);

export const where: Parser<number> = ctx => success(ctx.p);

export const debug = <T,>(child: Parser<T>): Parser<T> => ctx => {
    const before = ctx.p;
    debugger;
    const r = child(ctx);
    console.log(before, ctx.p, r);
    return r;
};

export const infix = <A, B>(a: Parser<A>, b: Parser<B>) => seq.add(a).add(star(seq.add(b).add(a).end)).end;

export const infixl = <A,>(a: Parser<A>, b: Parser<(l: A, r: A) => A>) => app(infix(a, b), ([a, bas]) => {
    return bas.reduce((p, [b, a]) => b(p, a), a);
});

export const infixr = <A,>(a: Parser<A>, b: Parser<(l: A, r: A) => A>) => app(infix(a, b), ([a, bas]) => {
    const as = [a, ...bas.map(x => x[1])], bs = bas.map(x => x[0]), na = as[as.length - 1]!; as.pop();
    return as.reduce((p, a, i) => bs[i]!(a, p), na);
});

export const prefix = <A,>(a: Parser<A>, b: Parser<(a: A) => A>) => {
    return app(seq.add(star(b)).add(a).end, ([bs, a]) => bs.reduce((p, b) => b(p), a));
};

export const suffix = <A,>(a: Parser<A>, b: Parser<(a: A) => A>) => {
    return app(seq.add(a).add(star(b)).end, ([a, bs]) => bs.reduce((p, b) => b(p), a));
};

export type Location = [from: number, to: number]
export type Located<T> = T & { loc: Location }
export const loc = <T,>(child: Parser<T>): Parser<Located<T>> => {
    return app(seq.add(where).add(child).add(where).end, ([start, child, end]) => ({ ... child, loc: [start, end] }));
};
