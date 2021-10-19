import type { PackageJSON } from '../types';

export const replaceDependency = ({
  packageJSON,
  from,
  to,
}: {
  packageJSON: PackageJSON;
  from: string;
  to?: [string, string];
}) => {
  const deps = packageJSON.dependencies;
  const devDeps = packageJSON.devDependencies;
  const [key, value] = to || [];

  if (deps) {
    if (deps[from]) {
      // eslint-disable-next-line no-param-reassign
      delete packageJSON.dependencies[from];

      if (key && !deps[key]) {
        // eslint-disable-next-line no-param-reassign
        packageJSON.dependencies[key] = value;
      }
    }
  }

  if (devDeps) {
    if (devDeps[from]) {
      // eslint-disable-next-line no-param-reassign
      delete packageJSON.devDependencies[from];

      if (key && !devDeps[key]) {
        // eslint-disable-next-line no-param-reassign
        packageJSON.devDependencies[key] = value;
      }
    }
  }
};
