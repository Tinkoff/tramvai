export interface BuilderCustomOptions {
  [key: string]: Record<string, any>;
}

export interface BuilderOptions {
  shouldBuildClient: boolean;
  shouldBuildServer: boolean;
}

export interface BuilderFactoryOptions<Name extends string> {
  options: BuilderOptions;
  customOptions?: BuilderCustomOptions[Name];
}

export interface BuilderFactory<Name extends string> {
  name: string;
  createBuilder(options: BuilderFactoryOptions<Name>): Builder<Name>;
}

export interface AbstractBuilderFactory {
  createBuilder<Name extends string>(
    name: Name,
    options: BuilderFactoryOptions<Name>
  ): Promise<Builder<Name>>;
}

interface BuilderStartOptions {
  strictError: boolean;
}

interface BuilderBuildOptions {
  modern: boolean;
}

interface BuilderAnalyzeOptions {
  plugin?: string;
}

export type GetBuildStats = () => {
  clientBuildTime?: number;
  clientModernBuildTime?: number;
  serverBuildTime?: number;
};

export type BuildType = 'client' | 'server' | 'clientModern';

export interface BuilderEvents {
  invalid: [];
  done: [];
  close: [];
}

export interface Builder<Name extends string> {
  name: Name;
  start(
    options: BuilderStartOptions
  ): Promise<{
    close: () => Promise<void>;
    invalidate: () => Promise<void>;
    getBuildStats: GetBuildStats;
  }>;
  build(
    options: BuilderBuildOptions
  ): Promise<{
    getBuildStats: GetBuildStats;
  }>;

  analyze(options: BuilderAnalyzeOptions): Promise<void>;

  on<T extends keyof BuilderEvents>(
    event: T,
    callback: (type: BuildType, ...args: BuilderEvents[T]) => void
  ): void;
}
