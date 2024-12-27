import { getExpectables } from './expectable';
import { Loc } from './loc';
import * as B from './basic';
import * as S from './spaced';
import { singleton } from './util';

export { Parser, alt, any, app, lex, lookNeg, lookPos, named, pure, lazy, regex, seq, star, str, stry, terminal, where, withLoc } from './spaced';
export * from './loc';
export * from './expectable';

export const left = <T, U>(left: S.Parser<T>, right: S.Parser<U>): S.Parser<T> => {
    return S.app(S.seq(left, right), ([l, _]) => l);
};

export const right = <T, U>(left: S.Parser<T>, right: S.Parser<U>): S.Parser<U> => {
    return S.app(S.seq(left, right), ([_, r]) => r);
};

export const field = <T, K extends string, V>(left: S.Parser<T>, key: K, right: S.Parser<V>): S.Parser<Record<K, T> & V> => {
    return S.app(S.seq(left, right), ([l, r]) => ({ ...singleton(key, l), ...r }));
};

export const plus = <T,>(child: S.Parser<T>): S.Parser<T[]> => {
    return S.app(
        S.seq(child, S.star(child)),
        ([a, as]) => (as.unshift(a), as)
    );
};

export const EPS = Object.freeze({});
export const eps: S.Parser<{}> = S.pure(EPS);

export const opt = <T,>(child: S.Parser<T>): S.Parser<T | undefined> => {
    return S.alt(child, S.app(eps, () => undefined))
};

export const eof: S.Parser<undefined> = S.lookNeg(S.any);

export type Located<T> = T & { readonly loc: Loc }
export const loc = <T,>(child: S.Parser<T>): S.Parser<Located<T>> => {
    return S.app(S.withLoc(child), ([t, loc]) => ({ ...t, loc }));
};

export const skipInitialSpaces = <T,>(child: S.Parser<T>, space: S.Parser<unknown>) => {
    return B.app(
        B.seq(
            B.star(space.keep),
            child.skip(space.keep),
        ),
        ([, t]) => t,
    );
};

export const consumesAll = <T,>(child: B.Parser<T>) => {
    return B.app(
        B.seq(
            child,
            B.lookNeg(B.any),
        ),
        ([t]) => t,
    );
};

export const ignoreLoc = <T,>(child: B.Parser<readonly [T, Loc]>) => {
    return B.app(
        child,
        ([t]) => t,
    );
};

export type ParseResult<T> = ParseResultSuccess<T> | ParseResultError
export type ParseResultError = {
    readonly $: "error";
    readonly error: {
        readonly position: number;
        readonly expected: ReadonlySet<string>;
    };
}
export type ParseResultSuccess<T> = {
    readonly $: "success";
    readonly value: T;
}

export type ParseOptions<T> = {
    text: string;
    grammar: S.Parser<T>;
    space: S.Parser<unknown>;
}

export const parse = <T>({ text, grammar, space }: ParseOptions<T>): ParseResult<T> => {
    const ctx: B.Context = B.createContext(text);

    const { result, exps } = ignoreLoc(consumesAll(skipInitialSpaces(grammar, space)))(ctx);

    if (!result.ok) {
        return {
            $: 'error',
            error: {
                position: exps?.at ?? -1,
                expected: getExpectables(exps?.exps ?? [])
            },
        };
    } else {
        return { $: 'success', value: B.getSuccess(result) };
    }
};