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
exports.withLoc = exports.where = exports.debug = exports.eof = exports.lookNeg = exports.lookPos = exports.opt = exports.plus = exports.fail = exports.eps = exports.any = exports.star = exports.ref = exports.app = exports.stry = exports.regex = exports.sat = exports.str = exports.alt = exports.field = exports.seq = exports.right = exports.left = exports.ap = exports.pure = exports.rule = void 0;
const P = __importStar(require("./runtime"));
const range = (start, end) => ({ $: 'range', start, end });
const empty = (at) => ({ $: 'empty', at });
const isEmpty = (loc) => loc.$ === 'empty';
const span = (left, right) => {
    return isEmpty(left) ? right : isEmpty(right) ? left : range(left.start, right.end);
};
const terminal = (p) => c => {
    const start = c.p;
    const r = p(c);
    if (P.isFailure(r))
        return P.failure;
    return P.success([P.getSuccess(r), range(start, c.p)]);
};
const rule = (child) => (ctx) => {
    const result = child(ctx);
    return result;
};
exports.rule = rule;
const pure = (t) => terminal(P.pure(t));
exports.pure = pure;
const ap = (left, right) => {
    return P.app(P.seq(left, right), ([[f, l], [x, r]]) => [f(x), span(l, r)]);
};
exports.ap = ap;
const left = (left, right) => {
    return P.app(P.seq(left, right), ([[t, l], [, r]]) => [t, span(l, r)]);
};
exports.left = left;
const right = (left, right) => {
    return P.app(P.seq(left, right), ([[, l], [u, r]]) => [u, span(l, r)]);
};
exports.right = right;
const seq = (left, right) => {
    return P.app(P.seq(left, right), ([[t, l], [u, r]]) => [[t, u], span(l, r)]);
};
exports.seq = seq;
const field = (left, key, right) => {
    return (0, exports.ap)((0, exports.app)(left, (l) => (r) => ({ ...P.singleton(key, l), ...r })), right);
};
exports.field = field;
const alt = (left, right) => {
    return P.alt(left, right);
};
exports.alt = alt;
const str = (s) => {
    return terminal(P.str(s));
};
exports.str = str;
const sat = (cond, message) => {
    return terminal(P.sat(cond, message));
};
exports.sat = sat;
const regex = (s, insensitive = false) => {
    return terminal(P.regex(s, insensitive));
};
exports.regex = regex;
const stry = (child) => {
    return terminal(P.stry(child));
};
exports.stry = stry;
const app = (child, f) => {
    return P.app(child, ([v, l]) => [f(v), l]);
};
exports.app = app;
const ref = (child) => {
    return P.ref(child);
};
exports.ref = ref;
const star = (child) => {
    return P.app(P.seq(exports.where, P.star(child)), ([[at], ls]) => [
        ls.map(([t]) => t),
        ls.map(([, l]) => l).reduce(span, empty(at))
    ]);
};
exports.star = star;
exports.any = terminal(P.any);
exports.eps = terminal(P.eps);
exports.fail = P.fail;
const plus = (child) => {
    return (0, exports.app)((0, exports.seq)(child, (0, exports.star)(child)), ([a, as]) => (as.unshift(a), as));
};
exports.plus = plus;
const opt = (child) => {
    return (0, exports.alt)(child, (0, exports.app)(exports.eps, () => undefined));
};
exports.opt = opt;
exports.lookPos = P.lookPos;
const lookNeg = (child) => {
    const p = (0, exports.lookPos)(child);
    return ctx => {
        const r = p(ctx);
        return P.isSuccess(r) ? P.failure : P.success([undefined, empty(ctx.p)]);
    };
};
exports.lookNeg = lookNeg;
exports.eof = (0, exports.lookNeg)(exports.any);
exports.debug = P.debug;
const where = ctx => P.success([ctx.p, empty(ctx.p)]);
exports.where = where;
const withLoc = (child) => {
    return P.app(child, ([t, loc]) => [[t, loc], loc]);
};
exports.withLoc = withLoc;
