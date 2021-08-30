/*
 * @TODO Типизировать проверку соотношения типов между provide и useValue/useClass/useFactory
 */

type Provide = string | any;

export type ScopeVariants = 'request' | 'singleton';

type ProviderOptions = { token: Provide; optional?: boolean; multi?: boolean };
export type ProviderDep = Provide | ProviderOptions;
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
  [P in keyof T]: T[P] extends string
    ? any // строковые токены = any
    : T[P] extends { token: infer OptionsToken; optional?: infer OptionsOptional, multi?: infer OptionsMulti  }
      ? OptionsType<OptionsToken, OptionsMulti, OptionsOptional>
    : T[P]; // Обычный токен
};

type ClassCreator<Deps, P extends Provide = any> = new (deps: ProvideDepsIterator<Deps>) => P;

type FactoryCreator<Deps, P extends Provide = any> = (deps: ProvideDepsIterator<Deps>) => P;

export interface FactoryProvider<Deps, P extends Provide = any> {
  /**
   * Идентификатор токена
   */
  provide: Provide;
  /**
   * Тип регистрации провайдера, будет ли глобальный синглтон или инстанс для клиента
   */
  scope?: ScopeVariants;
  /**
   * Список токенов которые нужны сервису. При получении зависимости
   * эти зависимости будут проинициализованы и переданны в функцию/класс
   */
  deps?: Deps;
  /**
   * Если true, то позволяет зарегистрировать несколько провайдеров на одном токен. Придет массив как значение
   */
  multi?: boolean;
  /**
   * Функция которая будет вызвана при инициализации провайдера и получит зависимости, если они были заданы
   */
  useFactory: FactoryCreator<Deps, P>;
}

export interface ClassProvider<Deps, P extends Provide = any> {
  /**
   * Идентификатор токена
   */
  provide: Provide;
  /**
   * Тип регистрации провайдера, будет ли глобальный синглтон или инстанс для клиента
   */
  scope?: ScopeVariants;
  /**
   * Список токенов которые нужны сервису. При получении зависимости
   * эти зависимости будут проинициализованы и переданны в функцию/класс
   */
  deps?: Deps;
  /**
   * Если true, то позволяет зарегистрировать несколько провайдеров на одном токен. Придет массив как значение
   */
  multi?: boolean;
  /**
   * Класс который будет создана  при инициализации провайдера и получит зависимости, если они были заданы
   */
  useClass: ClassCreator<Deps, P>;
}

export interface ValueProvider<P extends Provide = any> {
  /**
   * Идентификатор токена
   */
  provide: P;
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
  useValue: P;
}

export type Provider<Deps = any, P extends Provide = any> =
  | ValueProvider<P>
  | ClassProvider<Deps, P>
  | FactoryProvider<Deps, P>;
