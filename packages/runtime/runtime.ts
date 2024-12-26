import * as E from "./expectable";


export type Success<T> = { readonly ok: true, readonly value: T }
export const success = <T>(value: T): Success<T> => ({ ok: true, value });
export const getSuccess = <T>(t: Success<T>): T => t.value;

export type Failure = { readonly ok: false }
export const failure = (): Failure => ({ ok: false });

export type Result<T> = Success<T> | Failure

export const createContext = (s: string) => ({
    s,
    p: 0,
    l: s.length,
    ignoreErrors: false,
});

export type Context = ReturnType<typeof createContext>;

export type Parser<T> = (ctx: Context) => {
    result: Result<T>,
    exps: E.ExpSet,
};
export type GetResult<T> = T extends Parser<infer T> ? T : never;

export const terminal = <T>(
    kind: E.Expectable,
    child: (ctx: Context) => Result<T>
): Parser<T> => ctx => {
    const at = ctx.p;
    const result = child(ctx);
    return { result, exps: result.ok ? undefined : E.ExpSet([kind])(at) };
};

export const any: Parser<string> = terminal(E.ExpAny(), ctx => {
    const at = ctx.p;
    const c = ctx.s[at];
    if (ctx.p < ctx.l) {
        ctx.p += 1;
        return success(c);
    } else {
        return failure();
    }
});

export const range = (from: string, to: string): Parser<string> => terminal(E.ExpRange(from, to), ctx => {
    const at = ctx.p;
    const c = ctx.s[at];
    if (ctx.p < ctx.l && from <= c && c <= to) {
        ctx.p += 1;
        return success(c);
    } else {
        return failure();
    }
});

export const regex = <K = string>(s: string, exps: E.Expectable[]): Parser<K> => {
    const r = new RegExp(`^[${s}]$`);
    return ctx => {
        const at = ctx.p;
        const c = ctx.s[at];
        if (ctx.p < ctx.l && r.test(c)) {
            ctx.p += 1;
            return { result: success(c as K), exps: undefined };
        } else {
            return { result: failure(), exps: E.ExpSet(exps)(at) };
        }
    }
};

export const str = <K extends string>(s: K): Parser<K> => terminal(E.ExpString(s), ctx => {
    const at = ctx.p;
    if (ctx.s.substring(at, at + s.length) === s) {
        ctx.p += s.length;
        return success(s);
    } else {
        return failure();
    }
});

export const app = <A, B>(child: Parser<A>, f: (a: A) => B): Parser<B> => ctx => {
    const r = child(ctx);
    return {
        result: r.result.ok ? success(f(r.result.value)) : r.result,
        exps: r.exps,
    };
};

export const seq = <T, U>(left: Parser<T>, right: Parser<U>): Parser<[T, U]> => (ctx) => {
    const l = left(ctx);
    if (!l.result.ok) {
        return { result: l.result, exps: l.exps };
    }
    const r = right(ctx);
    const exps = E.max(l.exps, r.exps);
    if (!r.result.ok) {
        return { result: r.result, exps };
    }
    return {
        result: success([l.result.value, r.result.value]),
        exps,
    };
};

export const alt = <T, U>(left: Parser<T>, right: Parser<U>): Parser<T | U> => (ctx) => {
    const p = ctx.p;
    const l = left(ctx);
    if (l.result.ok) {
        return l;
    }
    ctx.p = p;
    const r = right(ctx);
    const exps = E.max(l.exps, r.exps);
    if (r.result.ok) {
        return { result: r.result, exps };
    }
    return { result: failure(), exps };
};

export const star = <T,>(child: Parser<T>): Parser<T[]> => ctx => {
    const result: T[] = [];
    let exps: undefined | E.ExpSet;
    let p = ctx.p;
    for (;;) {
        p = ctx.p;
        const r = child(ctx);
        exps = exps ? E.max(exps, r.exps) : r.exps;
        if (!r.result.ok) {
            ctx.p = p;
            return { result: success(result), exps };
        }
        result.push(getSuccess(r.result));
    }
};

export const ref = <A,>(child: () => Parser<A>): Parser<A> => {
    let p: null | Parser<A> = null;
    return ctx => (p || (p = child()))(ctx);
};

export const stry = <T,>(child: Parser<T>): Parser<string> => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    return {
        result: r.result.ok ? success(ctx.s.substring(p, ctx.p)) : r.result,
        exps: r.exps,
    };
};

export const lookPos = <T,>(child: Parser<T>): Parser<T> => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    ctx.p = p;
    return r;
};

export const lookNeg = <T,>(child: Parser<T>): Parser<undefined> => {
    const p = lookPos(child);
    return (ctx) => {
        const at = ctx.p;
        ctx.ignoreErrors = true;
        const r = p(ctx);
        const result = r.result.ok
            ? failure()
            : success(undefined);
        ctx.ignoreErrors = false;
        return { result, exps: E.negate(r.exps) };
    };
};

export const named = <T>(name: string, child: Parser<T>): Parser<T> => ctx => {
    const at = ctx.p;
    const r = child(ctx);
    return {
        result: r.result,
        exps: r.result.ok ? undefined : E.ExpSet([E.ExpNamed(name)])(at),
    };
};

export const where: Parser<number> = ctx => ({
    result: success(ctx.p),
    exps: undefined,
});