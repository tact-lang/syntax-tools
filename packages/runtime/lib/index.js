"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.withLoc = exports.where = exports.terminal = exports.stry = exports.str = exports.star = exports.seq = exports.sat = exports.rule = exports.right = exports.regex = exports.ref = exports.pure = exports.plus = exports.opt = exports.lookPos = exports.lookNeg = exports.loc = exports.lex = exports.left = exports.field = exports.eps = exports.eof = exports.debug = exports.compile = exports.app = exports.ap = exports.any = exports.alt = void 0;
const runtime_1 = require("./runtime");
var spaced_1 = require("./spaced");
Object.defineProperty(exports, "alt", { enumerable: true, get: function () { return spaced_1.alt; } });
Object.defineProperty(exports, "any", { enumerable: true, get: function () { return spaced_1.any; } });
Object.defineProperty(exports, "ap", { enumerable: true, get: function () { return spaced_1.ap; } });
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return spaced_1.app; } });
Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return spaced_1.compile; } });
Object.defineProperty(exports, "debug", { enumerable: true, get: function () { return spaced_1.debug; } });
Object.defineProperty(exports, "eof", { enumerable: true, get: function () { return spaced_1.eof; } });
Object.defineProperty(exports, "eps", { enumerable: true, get: function () { return spaced_1.eps; } });
Object.defineProperty(exports, "field", { enumerable: true, get: function () { return spaced_1.field; } });
Object.defineProperty(exports, "left", { enumerable: true, get: function () { return spaced_1.left; } });
Object.defineProperty(exports, "lex", { enumerable: true, get: function () { return spaced_1.lex; } });
Object.defineProperty(exports, "loc", { enumerable: true, get: function () { return spaced_1.loc; } });
Object.defineProperty(exports, "lookNeg", { enumerable: true, get: function () { return spaced_1.lookNeg; } });
Object.defineProperty(exports, "lookPos", { enumerable: true, get: function () { return spaced_1.lookPos; } });
Object.defineProperty(exports, "opt", { enumerable: true, get: function () { return spaced_1.opt; } });
Object.defineProperty(exports, "plus", { enumerable: true, get: function () { return spaced_1.plus; } });
Object.defineProperty(exports, "pure", { enumerable: true, get: function () { return spaced_1.pure; } });
Object.defineProperty(exports, "ref", { enumerable: true, get: function () { return spaced_1.ref; } });
Object.defineProperty(exports, "regex", { enumerable: true, get: function () { return spaced_1.regex; } });
Object.defineProperty(exports, "right", { enumerable: true, get: function () { return spaced_1.right; } });
Object.defineProperty(exports, "rule", { enumerable: true, get: function () { return spaced_1.rule; } });
Object.defineProperty(exports, "sat", { enumerable: true, get: function () { return spaced_1.sat; } });
Object.defineProperty(exports, "seq", { enumerable: true, get: function () { return spaced_1.seq; } });
Object.defineProperty(exports, "star", { enumerable: true, get: function () { return spaced_1.star; } });
Object.defineProperty(exports, "str", { enumerable: true, get: function () { return spaced_1.str; } });
Object.defineProperty(exports, "stry", { enumerable: true, get: function () { return spaced_1.stry; } });
Object.defineProperty(exports, "terminal", { enumerable: true, get: function () { return spaced_1.terminal; } });
Object.defineProperty(exports, "where", { enumerable: true, get: function () { return spaced_1.where; } });
Object.defineProperty(exports, "withLoc", { enumerable: true, get: function () { return spaced_1.withLoc; } });
const parse = (grammar) => (text) => {
    const ctx = (0, runtime_1.createContext)(text);
    const result = grammar(ctx);
    if ((0, runtime_1.isFailure)(result)) {
        return { $: 'error', error: ctx.getError() };
    }
    else {
        return { $: 'success', value: (0, runtime_1.getSuccess)(result) };
    }
};
exports.parse = parse;
