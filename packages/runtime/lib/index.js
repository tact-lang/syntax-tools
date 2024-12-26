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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.compile = exports.loc = exports.eof = exports.opt = exports.eps = exports.EPS = exports.plus = exports.field = exports.right = exports.left = exports.withLoc = exports.where = exports.terminal = exports.stry = exports.str = exports.star = exports.seq = exports.regex = exports.ref = exports.pure = exports.named = exports.lookPos = exports.lookNeg = exports.lex = exports.app = exports.any = exports.alt = void 0;
const expectable_1 = require("./expectable");
const B = __importStar(require("./runtime"));
const S = __importStar(require("./spaced"));
const util_1 = require("./util");
var spaced_1 = require("./spaced");
Object.defineProperty(exports, "alt", { enumerable: true, get: function () { return spaced_1.alt; } });
Object.defineProperty(exports, "any", { enumerable: true, get: function () { return spaced_1.any; } });
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return spaced_1.app; } });
Object.defineProperty(exports, "lex", { enumerable: true, get: function () { return spaced_1.lex; } });
Object.defineProperty(exports, "lookNeg", { enumerable: true, get: function () { return spaced_1.lookNeg; } });
Object.defineProperty(exports, "lookPos", { enumerable: true, get: function () { return spaced_1.lookPos; } });
Object.defineProperty(exports, "named", { enumerable: true, get: function () { return spaced_1.named; } });
Object.defineProperty(exports, "pure", { enumerable: true, get: function () { return spaced_1.pure; } });
Object.defineProperty(exports, "ref", { enumerable: true, get: function () { return spaced_1.ref; } });
Object.defineProperty(exports, "regex", { enumerable: true, get: function () { return spaced_1.regex; } });
Object.defineProperty(exports, "seq", { enumerable: true, get: function () { return spaced_1.seq; } });
Object.defineProperty(exports, "star", { enumerable: true, get: function () { return spaced_1.star; } });
Object.defineProperty(exports, "str", { enumerable: true, get: function () { return spaced_1.str; } });
Object.defineProperty(exports, "stry", { enumerable: true, get: function () { return spaced_1.stry; } });
Object.defineProperty(exports, "terminal", { enumerable: true, get: function () { return spaced_1.terminal; } });
Object.defineProperty(exports, "where", { enumerable: true, get: function () { return spaced_1.where; } });
Object.defineProperty(exports, "withLoc", { enumerable: true, get: function () { return spaced_1.withLoc; } });
__exportStar(require("./loc"), exports);
__exportStar(require("./expectable"), exports);
const left = (left, right) => {
    return S.app(S.seq(left, right), ([l, _]) => l);
};
exports.left = left;
const right = (left, right) => {
    return S.app(S.seq(left, right), ([_, r]) => r);
};
exports.right = right;
const field = (left, key, right) => {
    return S.app(S.seq(left, right), ([l, r]) => ({ ...(0, util_1.singleton)(key, l), ...r }));
};
exports.field = field;
const plus = (child) => {
    return S.app(S.seq(child, S.star(child)), ([a, as]) => (as.unshift(a), as));
};
exports.plus = plus;
exports.EPS = Object.freeze({});
exports.eps = S.pure(exports.EPS);
const opt = (child) => {
    return S.alt(child, S.app(exports.eps, () => undefined));
};
exports.opt = opt;
exports.eof = S.lookNeg(S.any);
const loc = (child) => {
    return S.app(S.withLoc(child), ([t, loc]) => ({ ...t, loc }));
};
exports.loc = loc;
const compile = (child, space) => {
    return B.app(B.seq(B.star(space.keep), B.seq(child.skip(space.keep), B.lookNeg(B.any))), ([, [[t]]]) => t);
};
exports.compile = compile;
const parse = (grammar) => (text) => {
    const ctx = B.createContext(text);
    const { result, exps } = grammar(ctx);
    if (!result.ok) {
        return {
            $: 'error',
            error: {
                position: exps?.at ?? -1,
                expected: (0, expectable_1.getExpectables)(exps?.exps ?? [])
            },
        };
    }
    else {
        return { $: 'success', value: B.getSuccess(result) };
    }
};
exports.parse = parse;
