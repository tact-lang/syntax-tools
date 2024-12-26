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
exports.withLoc = exports.where = exports.named = exports.lookNeg = exports.lookPos = exports.stry = exports.ref = exports.star = exports.alt = exports.seq = exports.app = exports.pure = exports.lex = exports.regex = exports.range = exports.str = exports.any = exports.lift2 = exports.lift1 = exports.terminal = void 0;
const B = __importStar(require("./runtime"));
const L = __importStar(require("./located"));
const P = (skip, keep) => ({ keep, skip });
const terminal = (child) => {
    return P(space => B.app(B.seq(child, B.star(space)), ([[t, l]]) => [t, l]), child);
};
exports.terminal = terminal;
const lift1 = (f) => (child) => {
    return P(space => f(child.skip(space)), f(child.keep));
};
exports.lift1 = lift1;
const lift2 = (f) => (l, r) => {
    return P(space => f(l.skip(space), r.skip(space)), f(l.keep, r.keep));
};
exports.lift2 = lift2;
exports.any = (0, exports.terminal)(L.any);
const str = (s) => {
    return (0, exports.terminal)(L.str(s));
};
exports.str = str;
const range = (from, to) => {
    return (0, exports.terminal)(L.range(from, to));
};
exports.range = range;
const regex = (s, exps, insensitive = false) => {
    return (0, exports.terminal)(L.regex(s, exps, insensitive));
};
exports.regex = regex;
const lex = (child) => {
    return (0, exports.terminal)(child.keep);
};
exports.lex = lex;
const pure = (t) => {
    const child = L.app(L.where, () => t);
    return P(() => child, child);
};
exports.pure = pure;
const app = (child, f) => {
    return P(space => L.app(child.skip(space), f), L.app(child.keep, f));
};
exports.app = app;
exports.seq = (0, exports.lift2)(L.seq);
exports.alt = (0, exports.lift2)(L.alt);
exports.star = (0, exports.lift1)(L.star);
const ref = (child) => {
    let p = null;
    const getP = () => p || (p = child());
    return P(space => ctx => getP().skip(space)(ctx), ctx => getP().keep(ctx));
};
exports.ref = ref;
exports.stry = (0, exports.lift1)(L.stry);
exports.lookPos = (0, exports.lift1)(L.lookPos);
exports.lookNeg = (0, exports.lift1)(L.lookNeg);
const named = (name, child) => {
    return P(space => L.named(name, child.skip(space)), L.named(name, child.keep));
};
exports.named = named;
exports.where = P(() => L.where, L.where);
exports.withLoc = (0, exports.lift1)(L.withLoc);
