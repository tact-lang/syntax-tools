export type Expectable = ExpAny | ExpString | ExpRange | ExpNamed;
export type ExpAny = {
    readonly $: 'any';
    readonly negated: boolean;
};
export declare const ExpAny: () => ExpAny;
export type ExpString = {
    readonly $: 'string';
    readonly value: string;
    readonly negated: boolean;
};
export declare const ExpString: (value: string) => ExpString;
export type ExpRange = {
    readonly $: 'range';
    readonly from: string;
    readonly to: string;
    readonly negated: boolean;
};
export declare const ExpRange: (from: string, to: string) => ExpRange;
export type ExpNamed = {
    readonly $: 'named';
    readonly name: string;
    readonly negated: boolean;
};
export declare const ExpNamed: (name: string) => ExpNamed;
export type ExpSet = undefined | {
    readonly at: number;
    readonly exps: Expectable[];
};
export declare const ExpSet: (exps: Expectable[]) => (at: number) => ExpSet;
export declare const max: (left: ExpSet, right: ExpSet) => ExpSet;
export declare const negateExps: (exps: Expectable[]) => Expectable[];
export declare const negate: (child: ExpSet) => ExpSet;
export declare const printExpectable: (node: Expectable) => string;
export declare const getExpectables: (exps: Expectable[]) => ReadonlySet<string>;
//# sourceMappingURL=expectable.d.ts.map