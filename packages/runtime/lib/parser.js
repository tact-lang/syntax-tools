export const success = (t) => [t];
export const getSuccess = (t) => t[0];
export const isSuccess = (t) => Boolean(t);
export const failure = null;
export const isFailure = (t) => !t;
const createContext = (s) => {
    let failPos = 0;
    let messages = new Set();
    const assert = (cond, message, len, result) => {
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
        const begin = prev[prev.length - 1];
        const col = begin.length;
        const context = begin + "\n" +
            new Array(begin.length + 1).fill('').join('.') +
            ctx.s.split('\n')[row - 1].substring(begin.length);
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
export class ParseError extends Error {
    constructor(message) {
        super(message);
    }
}
export const parse = (parser, code) => {
    const c = createContext(code);
    const r = parser(c);
    if (isFailure(r)) {
        throw new ParseError(c.getError());
    }
    return getSuccess(r);
};
export const pure = (t) => () => success(t);
export const ap = (left, right) => ctx => {
    const l = left(ctx);
    if (isFailure(l))
        return failure;
    const r = right(ctx);
    if (isFailure(r))
        return failure;
    return success(getSuccess(l)(getSuccess(r)));
};
export const pa = (left, right) => ctx => {
    const l = left(ctx);
    if (isFailure(l))
        return failure;
    const r = right(ctx);
    if (isFailure(r))
        return failure;
    return success(getSuccess(r)(getSuccess(l)));
};
export const left = (left, right) => ctx => {
    const l = left(ctx);
    if (isFailure(l))
        return failure;
    const r = right(ctx);
    if (isFailure(r))
        return failure;
    return l;
};
export const right = (left, right) => ctx => {
    const l = left(ctx);
    if (isFailure(l))
        return failure;
    const r = right(ctx);
    if (isFailure(r))
        return failure;
    return r;
};
const seq2 = (left, right) => ctx => {
    const l = left(ctx);
    if (isFailure(l))
        return failure;
    const r = right(ctx);
    if (isFailure(r))
        return failure;
    return success([...getSuccess(l), getSuccess(r)]);
};
const seqRec = (end) => ({
    end,
    add: child => seqRec(seq2(end, child)),
});
export const seq = seqRec(() => success([]));
// TS bug
export const singleton = (key, value) => ({ [key]: value });
export const field = (left, key, right) => {
    return ap(app(left, (l) => (r) => ({ ...singleton(key, l), ...r })), right);
};
const name2 = (left, key, right) => ctx => {
    const l = left(ctx);
    if (isFailure(l))
        return failure;
    const r = right(ctx);
    if (isFailure(r))
        return failure;
    return success({ ...getSuccess(l), ...singleton(key, getSuccess(r)) });
};
const nameRec = (end) => ({
    end,
    add: (key, child) => nameRec(name2(end, key, child)),
});
export const name = nameRec(() => success({}));
export const alt = (left, right) => (ctx) => {
    const p = ctx.p;
    const l = left(ctx);
    if (isSuccess(l))
        return l;
    ctx.p = p;
    return right(ctx);
};
const selRec = (end) => ({
    end,
    add: child => selRec(alt(end, child)),
});
export const sel = selRec(() => failure);
export const str = (s) => {
    const message = JSON.stringify(s);
    return ctx => ctx.assert(ctx.s.substring(ctx.p, ctx.p + s.length) === s, message, s.length, s);
};
export const sat = (cond, message) => ctx => {
    const c = ctx.s[ctx.p];
    return ctx.assert(ctx.p < ctx.l && cond(c), message, 1, c);
};
export const regex = (s, insensitive = false) => {
    const r = new RegExp(`^[${s}]$`, insensitive ? "i" : undefined);
    return sat(c => r.test(c), `[${s}]`);
};
export const stry = (child) => ctx => {
    const p = ctx.p;
    return child(ctx) ? success(ctx.s.substring(p, ctx.p)) : failure;
};
export const app = (child, f) => ctx => {
    const r = child(ctx);
    return isSuccess(r) ? success(f(getSuccess(r))) : failure;
};
export const ref = (child) => {
    let p = null;
    return ctx => (p || (p = child()))(ctx);
};
export const star = (child) => ctx => {
    const result = [];
    for (;;) {
        const r = child(ctx);
        if (isFailure(r))
            return success(result);
        result.push(getSuccess(r));
    }
};
export const any = sat(() => true, 'any character');
export const eof = ctx => ctx.p === ctx.l ? success(undefined) : failure;
export const EPS = Object.freeze({});
export const eps = () => success(EPS);
export const plus = (child) => app(seq.add(child).add(star(child)).end, ([a, as]) => (as.unshift(a), as));
export const opt = (child) => alt(child, app(eps, () => undefined));
export const lookPos = (child) => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    ctx.p = p;
    return r ? success(undefined) : failure;
};
export const lookNeg = (child) => {
    const p = lookPos(child);
    return ctx => isSuccess(p(ctx)) ? failure : success(undefined);
};
export const where = ctx => success(ctx.p);
export const debug = (child) => ctx => {
    const before = ctx.p;
    debugger;
    const r = child(ctx);
    console.log(before, ctx.p, r);
    return r;
};
export const infix = (a, b) => seq.add(a).add(star(seq.add(b).add(a).end)).end;
export const infixl = (a, b) => app(infix(a, b), ([a, bas]) => {
    return bas.reduce((p, [b, a]) => b(p, a), a);
});
export const infixr = (a, b) => app(infix(a, b), ([a, bas]) => {
    const as = [a, ...bas.map(x => x[1])], bs = bas.map(x => x[0]), na = as[as.length - 1];
    as.pop();
    return as.reduce((p, a, i) => bs[i](a, p), na);
});
export const prefix = (a, b) => {
    return app(seq.add(star(b)).add(a).end, ([bs, a]) => bs.reduce((p, b) => b(p), a));
};
export const suffix = (a, b) => {
    return app(seq.add(a).add(star(b)).end, ([a, bs]) => bs.reduce((p, b) => b(p), a));
};
export const loc = (child) => {
    return app(seq.add(where).add(child).add(where).end, ([start, child, end]) => ({ ...child, loc: [start, end] }));
};
