export type Options = {
  sourceDir: string;
  copyStaticAssets: boolean;
  watchMode?: boolean;
  forPublish?: boolean;
  preserveModules?: boolean;
  only?: 'migrations' | 'tests';
};
