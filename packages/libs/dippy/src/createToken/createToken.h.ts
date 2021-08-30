export interface TokenType<T> {
  name: string;
  options: TokenOptions;
  isToken: true;
  toString(): string;
}

export interface TokenOptions {
  multi?: boolean;
}
