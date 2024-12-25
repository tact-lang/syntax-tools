export type Loc = LocRange | LocEmpty;
export type LocRange = {
    readonly $: 'range';
    readonly start: number;
    readonly end: number;
};
export declare const rangeLoc: (start: number, end: number) => LocRange;
export type LocEmpty = {
    readonly $: 'empty';
    readonly at: number;
};
export declare const emptyLoc: (at: number) => LocEmpty;
export declare const isEmptyLoc: (loc: Loc) => loc is LocEmpty;
export declare const mergeLoc: (left: Loc, right: Loc) => Loc;
//# sourceMappingURL=loc.d.ts.map