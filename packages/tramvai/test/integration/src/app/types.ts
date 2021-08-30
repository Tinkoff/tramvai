import type { start } from '@tramvai/cli';

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
  ? R
  : never;

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type StartOptions = UnionToIntersection<Parameters<typeof start>[0]>;

export type CliResult = ThenArg<ReturnType<typeof start>>;
