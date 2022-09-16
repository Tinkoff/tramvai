import type { TokenType, TokenOptions } from './createToken.h';

/**
 * @private
 */
export const TOKENS_SYMBOL_BY_STRING_NAME_REGISTRY = new Map<string, symbol>();

/**
 * @private
 */
export function tokenToString(token: symbol): string {
  return token.toString().replace(/^Symbol\((.+)\)$/, '$1');
}

export class TokenClass<T> implements TokenType<T> {
  /**
   * Индетификатор токена
   */
  name: symbol;

  options: TokenOptions;

  isToken = true as const;

  // for potential breaking changes, not very useful at this moment
  isModernToken = true as const;

  constructor(name?: string, options: TokenOptions = {}) {
    this.name = name ? Symbol.for(name) : Symbol('token');
    this.options = options;

    if (process.env.NODE_ENV === 'development') {
      if (name) {
        if (!TOKENS_SYMBOL_BY_STRING_NAME_REGISTRY.has(name)) {
          TOKENS_SYMBOL_BY_STRING_NAME_REGISTRY.set(name, this.name);
        } else {
          console.error(`Token with name "${name}" already created!`);
        }
      }
    }
  }

  /**
   * toString будет использоваться для получения индитификатора токена
   */
  toString() {
    return tokenToString(this.name);
  }
}

const BASE_TOKEN_TYPE = 'base token';
const MULTI_TOKEN_TYPE = 'multi token';

export type BaseTokenInterface<T = any> = T & {
  __type?: typeof BASE_TOKEN_TYPE;
};

export type MultiTokenInterface<T = any> = T & {
  __type?: typeof MULTI_TOKEN_TYPE;
};

export type TokenInterface<T = any> = BaseTokenInterface<T> | MultiTokenInterface<T>;

export function createToken<Type = any>(name?: string): BaseTokenInterface<Type>;

export function createToken<Type = any>(
  name: string,
  options: { multi: true }
): MultiTokenInterface<Type>;

export function createToken<T = any>(name?: string, options?: TokenOptions): T {
  return new TokenClass<T>(name, options) as any as T;
}

/**
 * Helper function to declare a optional token dependency
 */
export function optional<Token extends TokenInterface<unknown>>(
  token: Token
): { token: Token; optional: true } {
  return { token, optional: true };
}

export type ExtractTokenType<Token extends TokenInterface<unknown>> = Token extends TokenInterface<
  infer Type
>
  ? Type
  : unknown;

// any type check from https://github.com/mmkal/expect-type/blob/main/src/index.ts
const secret = Symbol('secret');
type Secret = typeof secret;

type Not<T extends boolean> = T extends true ? false : true;
type IsNever<T> = [T] extends [never] ? true : false;
type IsAny<T> = [T] extends [Secret] ? Not<IsNever<T>> : false;

export type ExtractDependencyType<Token extends TokenInterface<unknown>> = IsAny<Token> extends true
  ? any
  : [Token] extends [MultiTokenInterface<infer Type>]
  ? Type[]
  : Token extends BaseTokenInterface<infer Type>
  ? Type
  : unknown;

export type OptionalTokenDependency<Type> = {
  token: TokenInterface<Type>;
  optional: boolean;
};
