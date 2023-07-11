// map of packages that is not in unified versioning
// but we still want to update it
// actual version to update will be calculated from the some of the @tramvai/module
export const DEPENDANT_LIBS_MAP = new Map([
  ['@tinkoff/logger', '@tramvai/module-log'],
  ['@tinkoff/dippy', '@tramvai/core'],
  ['@tinkoff/router', '@tramvai/module-router'],
  ['@tinkoff/url', '@tramvai/module-common'],
  ['@tinkoff/errors', '@tramvai/module-common'],
  ['@tinkoff/roles', '@tramvai/module-authenticate'],
  ['@tinkoff/pubsub', '@tramvai/module-common'],
  ['@tinkoff/hook-runner', '@tramvai/module-common'],
  ['@tinkoff/htmlpagebuilder', '@tramvai/module-render'],
  ['@tinkoff/browser-timings', '@tramvai/module-metrics'],
  ['@tinkoff/meta-tags-generate', '@tramvai/module-render'],
  ['@tinkoff/pack-polyfills', ''],
  ['@tinkoff/browserslist-config', '@tramvai/cli'],
  ['@tramvai/http-client', '@tramvai/module-http-client'],
  ['@tramvai/safe-strings', '@tramvai/module-render'],
  ['@tramvai-tinkoff/safe-strings', '@tramvai-tinkoff/module-router-extension-dco'],
  ['@tramvai-tinkoff/dco-client', '@tramvai-tinkoff/module-router-extension-dco'],
  ['@tramvai-tinkoff/dynamic-components', '@tramvai/module-dynamic-components'],
  ['@tramvai-tinkoff/media-checkers', ''],
  ['@tramvai-tinkoff/ui-container', ''],
  ['@tramvai-tinkoff/ui-grid', ''],
  ['@tramvai-tinkoff/ui-bp-desktop-md', ''],
]);

export const isUnifiedVersion = (name: string) => {
  return name.startsWith('@tramvai');
};

export const isDependantLib = (name: string) => {
  return DEPENDANT_LIBS_MAP.has(name);
};
