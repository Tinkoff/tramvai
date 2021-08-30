export const enum PartType {
  'literal',
  'historyFallback',
  'wildcard',
  'parameter',
}

export interface Parameter {
  type: PartType.parameter;
  paramName: string;
  regexp?: RegExp;
  optional?: boolean;
}

export type ParsedPath =
  | {
      type: PartType.literal;
      value: string;
    }
  | { type: PartType.historyFallback }
  | { type: PartType.wildcard }
  | Parameter;
