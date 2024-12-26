"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.where = exports.named = exports.lookNeg = exports.lookPos = exports.stry = exports.ref = exports.star = exports.alt = exports.seq = exports.app = exports.str = exports.regex = exports.range = exports.any = exports.terminal = exports.createContext = exports.failure = exports.getSuccess = exports.success = void 0;
const E = __importStar(require("./expectable"));
const success = (value) => ({ ok: true, value });
exports.success = success;
const getSuccess = (t) => t.value;
exports.getSuccess = getSuccess;
const failure = () => ({ ok: false });
exports.failure = failure;
const createContext = (s) => ({
    s,
    p: 0,
    l: s.length,
    ignoreErrors: false,
});
exports.createContext = createContext;
const terminal = (kind, child) => ctx => {
    const at = ctx.p;
    const result = child(ctx);
    return { result, exps: result.ok ? undefined : E.ExpSet([kind])(at) };
};
exports.terminal = terminal;
exports.any = (0, exports.terminal)(E.ExpAny(), ctx => {
    const at = ctx.p;
    const c = ctx.s[at];
    if (ctx.p < ctx.l) {
        ctx.p += 1;
        return (0, exports.success)(c);
    }
    else {
        return (0, exports.failure)();
    }
});
const range = (from, to) => (0, exports.terminal)(E.ExpRange(from, to), ctx => {
    const at = ctx.p;
    const c = ctx.s[at];
    if (ctx.p < ctx.l && from <= c && c <= to) {
        ctx.p += 1;
        return (0, exports.success)(c);
    }
    else {
        return (0, exports.failure)();
    }
});
exports.range = range;
const regex = (s, exps, insensitive = false) => {
    const r = new RegExp(`^[${s}]$`, insensitive ? "i" : undefined);
    return ctx => {
        const at = ctx.p;
        const c = ctx.s[at];
        if (ctx.p < ctx.l && r.test(c)) {
            ctx.p += 1;
            return { result: (0, exports.success)(c), exps: undefined };
        }
        else {
            return { result: (0, exports.failure)(), exps: E.ExpSet(exps)(at) };
        }
    };
};
exports.regex = regex;
const str = (s) => (0, exports.terminal)(E.ExpString(s), ctx => {
    const at = ctx.p;
    if (ctx.s.substring(at, at + s.length) === s) {
        ctx.p += s.length;
        return (0, exports.success)(s);
    }
    else {
        return (0, exports.failure)();
    }
});
exports.str = str;
// export const pure = <const T>(t: T): Parser<T> => () => success(t);
const app = (child, f) => ctx => {
    const r = child(ctx);
    return {
        result: r.result.ok ? (0, exports.success)(f(r.result.value)) : r.result,
        exps: r.exps,
    };
};
exports.app = app;
const seq = (left, right) => (ctx) => {
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
        result: (0, exports.success)([l.result.value, r.result.value]),
        exps,
    };
};
exports.seq = seq;
const alt = (left, right) => (ctx) => {
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
    return { result: (0, exports.failure)(), exps };
};
exports.alt = alt;
const star = (child) => ctx => {
    const result = [];
    let exps;
    let p = ctx.p;
    for (;;) {
        p = ctx.p;
        const r = child(ctx);
        exps = exps ? E.max(exps, r.exps) : r.exps;
        if (!r.result.ok) {
            ctx.p = p;
            return { result: (0, exports.success)(result), exps };
        }
        result.push((0, exports.getSuccess)(r.result));
    }
};
exports.star = star;
const ref = (child) => {
    let p = null;
    return ctx => (p || (p = child()))(ctx);
};
exports.ref = ref;
const stry = (child) => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    return {
        result: r.result.ok ? (0, exports.success)(ctx.s.substring(p, ctx.p)) : r.result,
        exps: r.exps,
    };
};
exports.stry = stry;
const lookPos = (child) => ctx => {
    const p = ctx.p;
    const r = child(ctx);
    ctx.p = p;
    return r;
};
exports.lookPos = lookPos;
const lookNeg = (child) => {
    const p = (0, exports.lookPos)(child);
    return (ctx) => {
        const at = ctx.p;
        ctx.ignoreErrors = true;
        const r = p(ctx);
        const result = r.result.ok
            ? (0, exports.failure)()
            : (0, exports.success)(undefined);
        ctx.ignoreErrors = false;
        return { result, exps: E.negate(r.exps) };
    };
};
exports.lookNeg = lookNeg;
const named = (name, child) => ctx => {
    const at = ctx.p;
    const r = child(ctx);
    return {
        result: r.result,
        exps: r.result.ok ? undefined : E.ExpSet([E.ExpNamed(name)])(at),
    };
};
exports.named = named;
const where = ctx => ({
    result: (0, exports.success)(ctx.p),
    exps: undefined,
});
exports.where = where;
