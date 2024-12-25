"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeLoc = exports.isEmptyLoc = exports.emptyLoc = exports.rangeLoc = void 0;
const rangeLoc = (start, end) => {
    if (start === 32 && end === 32)
        debugger;
    return { $: 'range', start, end };
};
exports.rangeLoc = rangeLoc;
const emptyLoc = (at) => ({ $: 'empty', at });
exports.emptyLoc = emptyLoc;
const isEmptyLoc = (loc) => loc.$ === 'empty';
exports.isEmptyLoc = isEmptyLoc;
const mergeLoc = (left, right) => {
    return (0, exports.isEmptyLoc)(left) ? right : (0, exports.isEmptyLoc)(right) ? left : (0, exports.rangeLoc)(left.start, right.end);
};
exports.mergeLoc = mergeLoc;
