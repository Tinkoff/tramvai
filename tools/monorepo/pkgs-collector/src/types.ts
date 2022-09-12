export type Package = {
  name: string;
  manifestPath: string;
  path: string;
  absPath: string;
  meta: {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
};

export interface CollectorInterface {
  name: string;

  collect(config?: Record<string, any>): Promise<{
    allPkgs: Package[];
    affectedPkgs: Package[];
  }>;

  cliOpts?: Array<{
    name: string;
    type?: 'boolean' | 'number' | 'string' | 'array';
    choices?: Array<string>;
    description?: string;
    required?: boolean;
    default?: any;
  }>;
}
