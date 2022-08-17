import once from '@tinkoff/utils/function/once';
import semver from 'semver';

// reference https://github.com/vercel/next.js/blob/canary/packages/next/server/config.ts#L736
export const shouldUseReactRoot = once(() => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const reactVersion = require('react').version;
  const isReactExperimental = reactVersion && /0\.0\.0-experimental/.test(reactVersion);
  const hasReact18 =
    reactVersion &&
    (semver.gte(reactVersion, '18.0.0') || semver.coerce(reactVersion)?.version === '18.0.0');

  return Boolean(hasReact18 || isReactExperimental);
});
