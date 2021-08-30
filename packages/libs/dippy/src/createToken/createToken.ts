import type { TokenType, TokenOptions } from './createToken.h';

export class TokenClass<T> implements TokenType<T> {
  /**
   * Индетификатор токена
   */
  name: string;

  options: TokenOptions;

  isToken: true = true;

  constructor(name: string, options: TokenOptions = {}) {
    this.name = name;
    this.options = options;
  }

  /**
   * toString будет использоваться для получения индитификатора токена
   */
  toString() {
    return this.name;
  }
}

export function createToken<T = any>(name: string, options?: TokenOptions): T {
  return (new TokenClass<T>(name, options) as any) as T;
}
