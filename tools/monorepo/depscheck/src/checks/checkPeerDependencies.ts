import path from 'path';
import minimatch from 'minimatch';
import semver from 'semver';
import type { CheckResults, Config, Package } from '../types';
import { resolvePkgMeta } from '../utils';

export type pkgPeerDepsDescription = {
  peerDependencies: Array<{ name: string; range: string }>;
  pkgPath: string;
  pkgName: string;
};

function resolvePkgDirectPeerDeps(pkg: Package) {
  const directPeerDependencies: Array<pkgPeerDepsDescription> = [];

  if (!pkg.meta.dependencies) {
    return directPeerDependencies;
  }

  Object.keys(pkg.meta.dependencies).forEach((dep) => {
    const { meta: depMeta, path: metaPath } = resolvePkgMeta(dep, pkg.absPath);
    if (depMeta.peerDependencies) {
      const directPeerDep: pkgPeerDepsDescription = {
        pkgPath: path.dirname(metaPath),
        pkgName: depMeta.name,
        peerDependencies: [],
      };
      Object.keys(depMeta.peerDependencies).forEach((peerDep) => {
        directPeerDep.peerDependencies.push({
          name: peerDep,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          range: depMeta.peerDependencies![peerDep],
        });
      });

      directPeerDependencies.push(directPeerDep);
    }
  });

  return directPeerDependencies;
}

export function checkPeerDependencies(
  allPkgs: Package[],
  pkg: Package,
  res: CheckResults,
  config: Config
) {
  const pkgPeerDependencies = resolvePkgDirectPeerDeps(pkg);

  pkgPeerDependencies.forEach(({ peerDependencies, pkgPath, pkgName }) => {
    peerDependencies.forEach(({ name, range }) => {
      if (config.ignorePeerDependencies?.some((p) => minimatch(name, p))) {
        return;
      }

      const inUnusedDepsIndex = res.dependencies.indexOf(name);
      if (inUnusedDepsIndex !== -1) {
        res.dependencies.splice(inUnusedDepsIndex, 1);
        return;
      }

      const totalDeps = { ...pkg.meta.dependencies, ...(pkg.meta as any).peerDependencies };

      if (!res.missing[name] && !totalDeps[name]) {
        const nv = `${name}@${range}`;
        res.missing[nv] = res.missing[nv] || [];
        res.missing[nv].push(`peer dependency of ${pkgPath}`);
        return;
      }

      if (totalDeps[name]) {
        const { meta: peerDepMeta } = resolvePkgMeta(name, pkgPath);
        if (!semver.satisfies(peerDepMeta.version, range, { includePrerelease: true })) {
          res.mismatched = res.mismatched || [];
          res.mismatched.push(
            `dep ${name}@${range} in ${pkgPath} is not satisfies with ${name}@${peerDepMeta.version} in installed modules`
          );
        }
      }
    });
  });
}
