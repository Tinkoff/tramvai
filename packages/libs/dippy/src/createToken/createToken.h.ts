export interface TokenType<T> {
  name: string;
  options: TokenOptions;
  isToken: true;
  isModernToken: true;
  toString(): string;
}

export interface TokenOptions {
  multi?: boolean;
}
