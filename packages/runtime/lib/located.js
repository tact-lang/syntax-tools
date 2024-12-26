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
exports.withLoc = exports.where = exports.named = exports.lookNeg = exports.lookPos = exports.stry = exports.ref = exports.star = exports.alt = exports.seq = exports.app = exports.regex = exports.str = exports.range = exports.any = void 0;
const P = __importStar(require("./runtime"));
const L = __importStar(require("./loc"));
const terminal = (p) => c => {
    const start = c.p;
    const r = p(c);
    if (!r.result.ok) {
        return { result: r.result, exps: r.exps };
    }
    return {
        result: P.success([r.result.value, L.rangeLoc(start, c.p)]),
        exps: r.exps,
    };
};
exports.any = terminal(P.any);
const range = (from, to) => {
    return terminal(P.range(from, to));
};
exports.range = range;
const str = (s) => {
    return terminal(P.str(s));
};
exports.str = str;
const regex = (s, exps) => {
    return terminal(P.regex(s, exps));
};
exports.regex = regex;
const app = (child, f) => {
    return P.app(child, ([v, l]) => [f(v), l]);
};
exports.app = app;
const seq = (left, right) => {
    return P.app(P.seq(left, right), ([[t, l], [u, r]]) => {
        return [[t, u], L.mergeLoc(l, r)];
    });
};
exports.seq = seq;
exports.alt = P.alt;
const star = (child) => {
    return P.app(P.seq(exports.where, P.star(child)), ([[at], ls]) => [
        ls.map(([t]) => t),
        ls.map(([, l]) => l).reduce(L.mergeLoc, L.emptyLoc(at))
    ]);
};
exports.star = star;
exports.ref = P.ref;
const stry = (child) => {
    return terminal(P.stry(child));
};
exports.stry = stry;
const lookPos = (child) => {
    return P.app(P.seq(P.where, P.lookPos(child)), ([loc, [t]]) => [t, L.emptyLoc(loc)]);
};
exports.lookPos = lookPos;
const lookNeg = (child) => {
    return P.app(P.seq(P.where, P.lookNeg(child)), ([loc]) => [undefined, L.emptyLoc(loc)]);
};
exports.lookNeg = lookNeg;
const named = (name, child) => {
    return P.named(name, child);
};
exports.named = named;
exports.where = P.app(P.where, (loc) => [loc, L.emptyLoc(loc)]);
const withLoc = (child) => {
    return P.app(child, ([t, loc]) => [[t, loc], loc]);
};
exports.withLoc = withLoc;
