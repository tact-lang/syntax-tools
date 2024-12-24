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
exports.compile = exports.lex = exports.loc = exports.withLoc = exports.where = exports.debug = exports.eof = exports.lookNeg = exports.lookPos = exports.opt = exports.plus = exports.eps = exports.any = exports.star = exports.ref = exports.app = exports.stry = exports.regex = exports.sat = exports.str = exports.alt = exports.field = exports.seq = exports.right = exports.left = exports.ap = exports.pure = exports.rule = exports.terminal = void 0;
const B = __importStar(require("./runtime"));
const L = __importStar(require("./located"));
const P = (skip, keep) => ({ keep, skip });
const terminal = (child) => {
    return P(space => B.app(B.seq(child, B.star(space)), ([[t, l]]) => [t, l]), child);
};
exports.terminal = terminal;
const rule = (child) => {
    return P(space => L.rule(child.skip(space)), L.rule(child.keep));
};
exports.rule = rule;
const pure = (t) => {
    const child = L.pure(t);
    return P(() => child, child);
};
exports.pure = pure;
const ap = (left, right) => {
    return P(space => L.ap(left.skip(space), right.skip(space)), L.ap(left.keep, right.keep));
};
exports.ap = ap;
const left = (left, right) => {
    return P(space => L.left(left.skip(space), right.skip(space)), L.left(left.keep, right.keep));
};
exports.left = left;
const right = (left, right) => {
    return P(space => L.right(left.skip(space), right.skip(space)), L.right(left.keep, right.keep));
};
exports.right = right;
const seq = (left, right) => {
    return P(space => L.seq(left.skip(space), right.skip(space)), L.seq(left.keep, right.keep));
};
exports.seq = seq;
const field = (left, key, right) => {
    return P(space => L.field(left.skip(space), key, right.skip(space)), L.field(left.keep, key, right.keep));
};
exports.field = field;
const alt = (left, right) => {
    return P(space => L.alt(left.skip(space), right.skip(space)), L.alt(left.keep, right.keep));
};
exports.alt = alt;
const str = (s) => {
    return (0, exports.terminal)(L.str(s));
};
exports.str = str;
const sat = (cond, message) => {
    return (0, exports.terminal)(L.sat(cond, message));
};
exports.sat = sat;
const regex = (s, insensitive = false) => {
    return (0, exports.terminal)(L.regex(s, insensitive));
};
exports.regex = regex;
const stry = (child) => {
    return P(space => L.stry(child.skip(space)), L.stry(child.keep));
};
exports.stry = stry;
const app = (child, f) => {
    return P(space => L.app(child.skip(space), f), L.app(child.keep, f));
};
exports.app = app;
const ref = (child) => {
    let p = null;
    return P(space => ctx => (p || (p = child())).skip(space)(ctx), ctx => (p || (p = child())).keep(ctx));
};
exports.ref = ref;
const star = (child) => {
    return P(space => L.star(child.skip(space)), L.star(child.keep));
};
exports.star = star;
exports.any = (0, exports.terminal)(L.any);
exports.eps = (0, exports.terminal)(L.eps);
const plus = (child) => {
    return P(space => L.plus(child.skip(space)), L.plus(child.keep));
};
exports.plus = plus;
const opt = (child) => {
    return P(space => L.opt(child.skip(space)), L.opt(child.keep));
};
exports.opt = opt;
const lookPos = (child) => {
    return P(space => L.lookPos(child.skip(space)), L.lookPos(child.keep));
};
exports.lookPos = lookPos;
const lookNeg = (child) => {
    return P(space => L.lookNeg(child.skip(space)), L.lookNeg(child.keep));
};
exports.lookNeg = lookNeg;
exports.eof = P(() => L.eof, L.eof);
const debug = (child) => {
    return P(space => L.debug(child.skip(space)), L.debug(child.keep));
};
exports.debug = debug;
exports.where = P(() => L.where, L.where);
const withLoc = (child) => {
    return P(space => L.withLoc(child.skip(space)), L.withLoc(child.keep));
};
exports.withLoc = withLoc;
const loc = (child) => {
    return (0, exports.app)((0, exports.withLoc)(child), ([t, loc]) => ({ ...t, loc }));
};
exports.loc = loc;
const lex = (child) => {
    return (0, exports.terminal)(child.keep);
};
exports.lex = lex;
const compile = (child, space) => {
    return B.app((0, exports.right)((0, exports.star)(space), (0, exports.left)(child, exports.eof)).skip(space.keep), ([t]) => t);
};
exports.compile = compile;
