import once from '@tinkoff/utils/function/once';
import { sync as resolve } from 'resolve';
import semver from 'semver';
import type { ConfigManager } from '../config/configManager';

// reference https://github.com/vercel/next.js/blob/canary/packages/next/server/config.ts#L736
export const shouldUseReactRoot = once((configManager: ConfigManager) => {
  // for cases, when different apps in one monorepo has different react versions
  const reactDomPath = resolve('react-dom', { basedir: configManager.rootDir });
  const reactDomVersion = require(reactDomPath).version;
  const isReactExperimental = Boolean(
    reactDomVersion && /0\.0\.0-experimental/.test(reactDomVersion)
  );
  const hasReact18: boolean =
    Boolean(reactDomVersion) &&
    (semver.gte(reactDomVersion, '18.0.0') || semver.coerce(reactDomVersion)?.version === '18.0.0');

  return hasReact18 || isReactExperimental;
});
