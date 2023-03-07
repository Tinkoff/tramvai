import type { LoaderDefinition } from 'webpack';

interface Options {
  name: string;
}

// eslint-disable-next-line func-style
const childAppFallback: LoaderDefinition<Options> = function () {
  const { name } = this.getOptions();

  /**
    Data below is required to UniversalModuleFederation to work on server-side
    basically these entries should be defined by the root-app itself
    but the definition code is executed only if we load the child-app with UniversalModuleFederation code
    i.e. by utilizing https://github.com/module-federation/universe/blob/02221527aa684d2a37773c913bf341748fd34ecf/packages/node/src/plugins/loadScript.ts#L66
    but:
    1. we are using are own wrapper to execute child-app code - with packages/modules/child-app/src/server/loader.ts
    2. although we could set it in our wrapper, but it won't work until the root-app is updated to actual version with fix

    So, provide the temporal fallback for child-app that utilizes the new version of @tramvai/cli.

    NOTE: ASSETS_PREFIX might not be exactly right option to use here, but it is the only way to figure out the request url of the child-app code
    and child-app server and client are usually deployed to the same url
  */
  return `
global.__remote_scope__ = global.__remote_scope__ || { _config: {} };
global.__remote_scope__._config["${name}"] = global.__remote_scope__._config["${name}"] || (ASSETS_PREFIX + 'server.js');
  `;
};

export default childAppFallback;
