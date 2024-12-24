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
exports.getAlgebra = void 0;
const B = __importStar(require("./runtime"));
const L = __importStar(require("./located"));
const P = (skip, keep) => ({ keep, skip });
const getAlgebra = (space) => {
    const spaced = (p) => {
        return B.app(B.seq(p, space), ([[t, l]]) => [t, l]);
    };
    const terminal = (child) => {
        return P(spaced(child), child);
    };
    const rule = (child) => {
        return P(L.rule(child.skip), L.rule(child.keep));
    };
    const pure = (t) => {
        const child = L.pure(t);
        return P(child, child);
    };
    const ap = (left, right) => {
        return P(L.ap(left.skip, right.skip), L.ap(left.keep, right.keep));
    };
    const left = (left, right) => {
        return P(L.left(left.skip, right.skip), L.left(left.keep, right.keep));
    };
    const right = (left, right) => {
        return P(L.right(left.skip, right.skip), L.right(left.keep, right.keep));
    };
    const seq = (left, right) => {
        return P(L.seq(left.skip, right.skip), L.seq(left.keep, right.keep));
    };
    const field = (left, key, right) => {
        return P(L.field(left.skip, key, right.skip), L.field(left.keep, key, right.keep));
    };
    const alt = (left, right) => {
        return P(L.alt(left.skip, right.skip), L.alt(left.keep, right.keep));
    };
    const str = (s) => {
        return terminal(L.str(s));
    };
    const sat = (cond, message) => {
        return terminal(L.sat(cond, message));
    };
    const regex = (s, insensitive = false) => {
        return terminal(L.regex(s, insensitive));
    };
    const stry = (child) => {
        return P(L.stry(child.skip), L.stry(child.keep));
    };
    const app = (child, f) => {
        return P(L.app(child.skip, f), L.app(child.keep, f));
    };
    const ref = (child) => {
        return P(L.ref(() => child().skip), L.ref(() => child().keep));
    };
    const star = (child) => {
        return P(L.star(child.skip), L.star(child.keep));
    };
    const any = terminal(L.any);
    const eps = terminal(L.eps);
    const plus = (child) => {
        return P(L.plus(child.skip), L.plus(child.keep));
    };
    const opt = (child) => {
        return P(L.opt(child.skip), L.opt(child.keep));
    };
    const lookPos = (child) => {
        return P(L.lookPos(child.skip), L.lookPos(child.keep));
    };
    const lookNeg = (child) => {
        return P(L.lookNeg(child.skip), L.lookNeg(child.keep));
    };
    const eof = P(L.eof, L.eof);
    const debug = (child) => {
        return P(L.debug(child.skip), L.debug(child.keep));
    };
    const where = P(L.where, L.where);
    const withLoc = (child) => {
        return P(L.withLoc(child.skip), L.withLoc(child.keep));
    };
    const loc = (child) => {
        return app(withLoc(child), ([t, loc]) => ({ ...t, loc }));
    };
    const lex = (child) => {
        return terminal(child.keep);
    };
    const compile = (child, space) => {
        return B.app(right(ref(space), left(child, eof)).skip, ([t]) => t);
    };
    return {
        rule,
        pure,
        ap,
        left,
        right,
        seq,
        field,
        alt,
        str,
        sat,
        regex,
        stry,
        app,
        ref,
        star,
        any,
        eps,
        plus,
        opt,
        lookPos,
        lookNeg,
        eof,
        debug,
        where,
        withLoc,
        loc,
        lex,
        compile,
    };
};
exports.getAlgebra = getAlgebra;
