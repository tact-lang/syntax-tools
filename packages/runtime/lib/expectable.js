"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpectables = exports.printExpectable = exports.negate = exports.negateExps = exports.max = exports.ExpSet = exports.ExpNamed = exports.ExpRange = exports.ExpString = exports.ExpAny = void 0;
const ExpAny = () => ({ $: 'any', negated: false });
exports.ExpAny = ExpAny;
const ExpString = (value) => ({ $: 'string', value, negated: false });
exports.ExpString = ExpString;
const ExpRange = (from, to) => ({ $: 'range', from, to, negated: false });
exports.ExpRange = ExpRange;
const ExpNamed = (name) => ({ $: 'named', name, negated: false });
exports.ExpNamed = ExpNamed;
const ExpSet = (exps) => (at) => ({ at, exps });
exports.ExpSet = ExpSet;
const max = (left, right) => {
    if (!left)
        return right;
    if (!right)
        return left;
    if (left.at > right.at)
        return left;
    if (left.at < right.at)
        return right;
    return { at: left.at, exps: [...left.exps, ...right.exps] };
};
exports.max = max;
const negateExps = (exps) => {
    return exps.map(child => {
        return { ...child, negated: !child.negated };
    });
};
exports.negateExps = negateExps;
const negate = (child) => {
    return child && { at: child.at, exps: (0, exports.negateExps)(child.exps) };
};
exports.negate = negate;
const addNot = (node, s) => (node.negated ? 'not ' : '') + s;
const printExpectable = (node) => {
    switch (node.$) {
        case 'any': return node.negated ? 'end of input' : 'any character';
        case 'named': return addNot(node, node.name);
        case 'range': return addNot(node, JSON.stringify(node.from) + '..' + JSON.stringify(node.to));
        case 'string': return addNot(node, JSON.stringify(node.value));
    }
};
exports.printExpectable = printExpectable;
const getKey = (exp) => {
    return JSON.stringify({ ...exp, negated: false });
};
const spaceKey = getKey((0, exports.ExpNamed)("space"));
const getExpectables = (exps) => {
    const emitted = new Map();
    const removed = new Set();
    for (const exp of exps) {
        const key = getKey(exp);
        if (removed.has(key)) {
            continue;
        }
        const previous = emitted.get(key);
        if (previous) {
            if (previous.negated === exp.negated) {
                // already added
            }
            else {
                // cancel out
                emitted.delete(key);
                removed.add(key);
            }
        }
        else {
            // new
            emitted.set(key, exp);
        }
    }
    if (emitted.size > 1 && emitted.has(spaceKey)) {
        emitted.delete(spaceKey);
    }
    ;
    return new Set([...emitted.values()].map(exports.printExpectable));
};
exports.getExpectables = getExpectables;
