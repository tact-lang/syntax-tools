export type Expectable = ExpAny | ExpString | ExpRange | ExpNamed
export type ExpAny = { readonly $: 'any', readonly negated: boolean }
export const ExpAny = (): ExpAny => ({ $: 'any', negated: false });
export type ExpString = { readonly $: 'string', readonly value: string, readonly negated: boolean }
export const ExpString = (value: string): ExpString => ({ $: 'string', value, negated: false });
export type ExpRange = { readonly $: 'range', readonly from: string, readonly to: string, readonly negated: boolean }
export const ExpRange = (from: string, to: string): ExpRange => ({ $: 'range', from, to, negated: false });
export type ExpNamed = { readonly $: 'named', readonly name: string, readonly negated: boolean }
export const ExpNamed = (name: string): ExpNamed => ({ $: 'named', name, negated: false });
export type ExpSet = undefined | { readonly at: number, readonly exps: Expectable[] }
export const ExpSet = (exps: Expectable[]) => (at: number): ExpSet => ({ at, exps });

export const max = (left: ExpSet, right: ExpSet): ExpSet => {
    if (!left) return right;
    if (!right) return left;
    if (left.at > right.at) return left;
    if (left.at < right.at) return right;
    return { at: left.at, exps: [...left.exps, ...right.exps] };
};

export const negateExps = (exps: Expectable[]): Expectable[] => {
    return exps.map(child => {
        return { ...child, negated: !child.negated };
    });
};

export const negate = (child: ExpSet): ExpSet => {
    return child && { at: child.at, exps: negateExps(child.exps) };
};

const addNot = (node: Expectable, s: string) => (node.negated ? 'not ' : '') + s;
export const printExpectable = (node: Expectable): string => {
    switch (node.$) {
        case 'any': return node.negated ? 'end of input' : 'any character';
        case 'named': return addNot(node, node.name);
        case 'range': return addNot(node, JSON.stringify(node.from) + '..' + JSON.stringify(node.to));
        case 'string': return addNot(node, JSON.stringify(node.value));
    }
};

const getKey = (exp: Expectable): string => {
    return JSON.stringify({ ...exp, negated: false });
};

const spaceKey = getKey(ExpNamed("space"));

export const getExpectables = (exps: Expectable[]): ReadonlySet<string> => {
    const emitted: Map<string, Expectable> = new Map();
    const removed: Set<string> = new Set();
    for (const exp of exps) {
        const key = getKey(exp);
        if (removed.has(key)) {
            continue;
        }
        const previous = emitted.get(key);
        if (previous) {
            if (previous.negated === exp.negated) {
                // already added
            } else {
                // cancel out
                emitted.delete(key);
                removed.add(key);
            }
        } else {
            // new
            emitted.set(key, exp);
        }
    }

    if (emitted.size > 1 && emitted.has(spaceKey)) {
        emitted.delete(spaceKey);
    };

    return new Set([...emitted.values()].map(printExpectable));
};