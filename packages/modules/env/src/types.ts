export interface EnvParameter {
  key: string;
  value?: string;
  optional?: boolean;
  validator?: (value: string) => boolean | string;
  dehydrate?: boolean;
}
