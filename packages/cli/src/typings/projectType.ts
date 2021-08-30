import type { ConfigEntry } from './configEntry/common';

export type ProjectType = 'application' | 'module' | 'package';

export type BuildType = 'server' | 'client';

export type SyncJsonFile = ({
  path,
  newContent,
}: {
  path: string;
  newContent: any;
}) => Promise<void>;

export type Config = {
  // @deprecated
  projectsConfig?: any;
  $schema?: string;
  projects: { [name: string]: ConfigEntry };
};
