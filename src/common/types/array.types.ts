export type Unit<T> = T extends Array<infer R> ? R : T;

export type EnumValue<T> = T extends Record<string | number | symbol, infer R> ? R : never