// TS bug
export const singleton = <K extends string, V>(key: K, value: V): Record<K, V> => ({ [key]: value }) as Record<K, V>;
