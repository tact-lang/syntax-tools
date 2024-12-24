"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.eof = exports.lookNeg = exports.lookPos = exports.opt = exports.plus = exports.fail = exports.eps = exports.EPS = exports.any = exports.star = exports.ref = exports.app = exports.stry = exports.regex = exports.sat = exports.str = exports.alt = exports.field = exports.singleton = exports.seq = exports.right = exports.left = exports.ap = exports.pure = exports.rule = exports.createContext = exports.isFailure = exports.failure = exports.isSuccess = exports.getSuccess = exports.success = void 0;
const success = (t) => [t];
exports.success = success;
const getSuccess = (t) => t[0];
exports.getSuccess = getSuccess;
const isSuccess = (t) => Boolean(t);
exports.isSuccess = isSuccess;
exports.failure = null;
const isFailure = (t) => !t;
exports.isFailure = isFailure;
const createContext = (s) => {
    let failPos = 0;
    let messages = new Set();
    const assert = (cond, message, len, result) => {
        if (cond) {
            ctx.p += len;
            return (0, exports.success)(result);
        }
        if (ctx.p > failPos) {
            failPos = ctx.p;
            messages = new Set();
        }
        if (ctx.p === failPos) {
            messages.add(message);
        }
        return exports.failure;
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
exports.createContext = createContext;
const rule = (child) => (ctx) => {
    const result = child(ctx);
    return result;
};
exports.rule = rule;
const pure = (t) => () => (0, exports.success)(t);
exports.pure = pure;
const ap = (left, right) => ctx => {
    const l = left(ctx);
    if ((0, exports.isFailure)(l))
        return exports.failure;
    const r = right(ctx);
    if ((0, exports.isFailure)(r))
        return exports.failure;
    return (0, exports.success)((0, exports.getSuccess)(l)((0, exports.getSuccess)(r)));
};
exports.ap = ap;
const left = (left, right) => ctx => {
    const l = left(ctx);
    if ((0, exports.isFailure)(l))
        return exports.failure;
    const r = right(ctx);
    if ((0, exports.isFailure)(r))
        return exports.failure;
    return l;
};
exports.left = left;
const right = (left, right) => ctx => {
    const l = left(ctx);
    if ((0, exports.isFailure)(l))
        return exports.failure;
    const r = right(ctx);
    if ((0, exports.isFailure)(r))
        return exports.failure;
    return r;
};
exports.right = right;
const seq = (left, right) => ctx => {
    const l = left(ctx);
    if ((0, exports.isFailure)(l))
        return exports.failure;
    const r = right(ctx);
    if ((0, exports.isFailure)(r))
        return exports.failure;
    return (0, exports.success)([(0, exports.getSuccess)(l), (0, exports.getSuccess)(r)]);
};
exports.seq = seq;
// TS bug
const singleton = (key, value) => ({ [key]: value });
exports.singleton = singleton;
const field = (left, key, right) => {
    return (0, exports.ap)((0, exports.app)(left, (l) => (r) => ({ ...(0, exports.singleton)(key, l), ...r })), right);
};
exports.field = field;
const alt = (left, right) => (ctx) => {
    const p = ctx.p;
    const l = left(ctx);
    if ((0, exports.isSuccess)(l))
        return l;
    ctx.p = p;
    return right(ctx);
};
exports.alt = alt;
const str = (s) => {
    const message = JSON.stringify(s);
    return ctx => ctx.assert(ctx.s.substring(ctx.p, ctx.p + s.length) === s, message, s.length, s);
};
exports.str = str;
const sat = (cond, message) => ctx => {
    const c = ctx.s[ctx.p];
    return ctx.assert(ctx.p < ctx.l && cond(c), message, 1, c);
};
exports.sat = sat;
const regex = (s, insensitive = false) => {
    const r = new RegExp(`^[${s}]$`, insensitive ? "i" : undefined);
    return (0, exports.sat)(c => r.test(c), `[${s}]`);
};
exports.regex = regex;
const stry = (child) => ctx => {
    const p = ctx.p;
    return child(ctx) ? (0, exports.success)(ctx.s.substring(p, ctx.p)) : exports.failure;
};
exports.stry = stry;
const app = (child, f) => ctx => {
    const r = child(ctx);
    return (0, exports.isSuccess)(r) ? (0, exports.success)(f((0, exports.getSuccess)(r))) : exports.failure;
};
exports.app = app;
const ref = (child) => {
    let p = null;
    return ctx => (p || (p = child()))(ctx);
};
exports.ref = ref;
const star = (child) => ctx => {
    const result = [];
    let p = ctx.p;
    for (;;) {
        p = ctx.p;
        const r = child(ctx);
        if ((0, exports.isFailure)(r)) {
            ctx.p = p;
            return (0, exports.success)(result);
        }
        result.push((0, exports.getSuccess)(r));
    }
};
exports.star = star;
exports.any = (0, exports.sat)(() => true, 'any character');
exports.EPS = Object.freeze({});
const eps = () => (0, exports.success)(exports.EPS);
exports.eps = eps;
const fail = () => exports.failure;
exports.fail = fail;
const plus = (child) => {
    return (0, exports.app)((0, exports.seq)(child, (0, exports.star)(child)), ([a, as]) => (as.unshift(a), as));
};
exports.plus = plus;
const opt = (child) => {
    return (0, exports.alt)(child, (0, exports.app)(exports.eps, () => undefined));
};
exports.opt = opt;
const lookPos = (child) => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    ctx.p = p;
    return r;
};
exports.lookPos = lookPos;
const lookNeg = (child) => {
    const p = (0, exports.lookPos)(child);
    return ctx => (0, exports.isSuccess)(p(ctx)) ? exports.failure : (0, exports.success)(undefined);
};
exports.lookNeg = lookNeg;
exports.eof = (0, exports.lookNeg)(exports.any);
const debug = (child) => ctx => {
    const before = ctx.p;
    debugger;
    const r = child(ctx);
    console.log(before, ctx.p, r);
    return r;
};
exports.debug = debug;
