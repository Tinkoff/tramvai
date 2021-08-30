export type Package = {
  name: string;
  dependencies?: {
    [key: string]: string;
  };
  peerDependencies?: {
    [key: string]: string;
  };
  devDependencies?: {
    [key: string]: string;
  };
};

export type ModuleMetaInfo = {
  pkg: Package;
  tsconfig: {
    compilerOptions: import('typescript').CompilerOptions;
    references?: Array<{ path: string }>;
  };
  resolvedRefs?: Package[];
  tsconfigPath: string;
  pkgPath: string;
  touched?: boolean;
};

export type SolutionMetaInfo = {
  solutionConfig: {
    references: Array<{ path: string }>;
  };
  solutionConfigPath: string;
  touched?: boolean;
};

export type Messages = string[];

export type TsConfig = {
  [key: string]: any;
  compilerOptions: {
    [key: string]: any;
    composite?: boolean;
    rootDir?: string;
  };
  references: Array<{
    path: string;
  }>;
};
