import type { Configuration } from 'webpack';

export function removeRules({
  baseConfig,
  extensions,
}: {
  baseConfig: Configuration;
  extensions: RegExp;
}) {
  // eslint-disable-next-line no-param-reassign
  baseConfig.module.rules = baseConfig.module.rules.filter(
    (rule) => typeof rule !== 'string' && !String(rule.test?.toString()).match(extensions)
  );
}
