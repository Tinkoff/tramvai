import type {
  TokenInterface,
  ExtractTokenType,
  OptionalTokenDependency,
  ExtractDependencyType,
} from './createToken/createToken';

type Provide = TokenInterface<unknown> | string | any;

export type ScopeVariants = 'request' | 'singleton';

type ProviderOptions = { token: Provide; optional?: boolean; multi?: boolean };
export type ProviderDep = Provide | OptionalTokenDependency<unknown> | ProviderOptions;
export type ProviderDeps = Record<string, ProviderDep>;

// если есть multi параметр, то это массив данных
type MultiEnhance<Option, Value> = Option extends true ? Value[] : Value;
// если есть optional параметр, то мы должны давать или значение или null. Работает только в strict режиме
type OptionalEnhance<Option, Value> = Option extends true ? Value | null : Value;

// обрабатываем options тип
export type OptionsType<OptionsToken, OptionsMulti, OptionsOptional> = OptionsToken extends string
  ? OptionalEnhance<OptionsOptional, MultiEnhance<OptionsMulti, any>>
  : OptionalEnhance<OptionsOptional, MultiEnhance<OptionsMulti, OptionsToken>>;

// prettier-ignore
export type ProvideDepsIterator<T> = {
  [P in keyof T]: T[P] extends OptionalTokenDependency<unknown>
  ? (ExtractDependencyType<T[P]['token']> | null)
  : T[P] extends TokenInterface<unknown>
    ? ExtractDependencyType<T[P]>
    : T[P] extends string
      ? any // строковые токены = any
      : T[P] extends { token: infer OptionsToken; optional?: infer OptionsOptional, multi?: infer OptionsMulti  }
        ? OptionsType<OptionsToken, OptionsMulti, OptionsOptional>
        : T[P]; // Обычный токен
};

// prettier-ignore
type ClassCreator<Deps, P extends Provide = any> = new (
  deps: ProvideDepsIterator<Deps>
) => P extends TokenInterface<unknown>
  ? ExtractTokenType<P>
  : P extends string
    ? any
    : P;

// prettier-ignore
type FactoryCreator<Deps, P extends Provide = any> = (
  deps: ProvideDepsIterator<Deps>
) => P extends TokenInterface<unknown>
  ? ExtractTokenType<P>
  : P extends string
    ? any
    : P;

interface FactoryProviderBase<P extends Provide> {
  /**
   * Идентификатор токена
   */
  provide: P extends TokenInterface<unknown> ? P : Provide;
  /**
   * Тип регистрации провайдера, будет ли глобальный синглтон или инстанс для клиента
   */
  scope?: ScopeVariants;
  /**
   * Если true, то позволяет зарегистрировать несколько провайдеров на одном токен. Придет массив как значение
   */
  multi?: boolean;
}

export interface FactoryProviderWithoutDeps<P extends Provide> extends FactoryProviderBase<P> {
  /**
   * Функция которая будет вызвана при инициализации провайдера и получит зависимости, если они были заданы
   */
  useFactory: () => P extends TokenInterface<unknown> ? ExtractTokenType<P> : Provide;
}

export interface FactoryProviderWithDeps<Deps, P extends Provide> extends FactoryProviderBase<P> {
  /**
   * Список токенов которые нужны сервису. При получении зависимости
   * эти зависимости будут проинициализованы и переданны в функцию/класс
   */
  deps: Deps;
  /**
   * Функция которая будет вызвана при инициализации провайдера и получит зависимости, если они были заданы
   */
  useFactory: FactoryCreator<Deps, P>;
}

export type FactoryProvider<Deps, P extends Provide = any> =
  | FactoryProviderWithDeps<Deps, P>
  | FactoryProviderWithoutDeps<P>;

interface ClassProviderBase<P extends Provide> {
  /**
   * Идентификатор токена
   */
  provide: P extends TokenInterface<unknown> ? P : Provide;
  /**
   * Тип регистрации провайдера, будет ли глобальный синглтон или инстанс для клиента
   */
  scope?: ScopeVariants;
  /**
   * Если true, то позволяет зарегистрировать несколько провайдеров на одном токен. Придет массив как значение
   */
  multi?: boolean;
}

export interface ClassProviderWithoutDeps<P extends Provide> extends ClassProviderBase<P> {
  /**
   * Класс который будет создана  при инициализации провайдера и получит зависимости, если они были заданы
   */
  useClass: new () => P extends TokenInterface<unknown> ? ExtractTokenType<P> : Provide;
}

export interface ClassProviderWithDeps<Deps, P extends Provide> extends ClassProviderBase<P> {
  /**
   * Список токенов которые нужны сервису. При получении зависимости
   * эти зависимости будут проинициализованы и переданны в функцию/класс
   */
  deps: Deps;
  /**
   * Класс который будет создана  при инициализации провайдера и получит зависимости, если они были заданы
   */
  useClass: ClassCreator<Deps, P>;
}

export type ClassProvider<Deps, P extends Provide = any> =
  | ClassProviderWithDeps<Deps, P>
  | ClassProviderWithoutDeps<P>;

export interface ValueProvider<P extends Provide = any> {
  /**
   * Идентификатор токена
   */
  provide: P extends TokenInterface<unknown> ? P : Provide;
  /**
   * Тип регистрации провайдера, будет ли глобальный синглтон или инстанс для клиента
   */
  scope?: ScopeVariants;
  /**
   * Если true, то позволяет зарегистрировать несколько провайдеров на одном токен. Придет массив как значение
   */
  multi?: boolean;
  /**
   * Простое значение, которое будет доступно
   */
  // prettier-ignore
  useValue: P extends TokenInterface<unknown>
    ? ExtractTokenType<P>
    : P extends string
      ? any
      : P;
}

export type Provider<Deps = any, P extends Provide = any> =
  | ValueProvider<P>
  | ClassProvider<Deps, P>
  | FactoryProvider<Deps, P>;
