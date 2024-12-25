export type Loc = LocRange | LocEmpty
export type LocRange = { readonly $: 'range', readonly start: number, readonly end: number };
export const rangeLoc = (start: number, end: number): LocRange => {
    if (start === 32 && end === 32) debugger;
    return { $: 'range', start, end };
};
export type LocEmpty = { readonly $: 'empty', readonly at: number }
export const emptyLoc = (at: number): LocEmpty => ({ $: 'empty', at });
export const isEmptyLoc = (loc: Loc): loc is LocEmpty => loc.$ === 'empty';

export const mergeLoc = (left: Loc, right: Loc): Loc => {
    return isEmptyLoc(left) ? right : isEmptyLoc(right) ? left : rangeLoc(left.start, right.end);
};