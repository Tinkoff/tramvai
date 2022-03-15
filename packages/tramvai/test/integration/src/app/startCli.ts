import { Writable } from 'stream';
import { start } from '@tramvai/cli';
import type { PromiseType } from 'utility-types';
import waitOn from 'wait-on';
import { requestFactory, renderFactory } from '@tramvai/test-helpers';
import type { StartOptions } from './types';
import { getServerUrl, getStaticUrl } from './utils';
import { wrapPapi } from './papi';
import { wrapMocker } from './mocker';

export * from './utils';

export interface StartCliOptions extends Omit<StartOptions, 'config' | 'target'> {
  enableRebuild?: boolean;
  logger?: Pick<typeof console, 'log' | 'error'>;
}

export const startCli = async (
  targetOrConfig: StartOptions['target'] | StartOptions['config'],
  { enableRebuild = false, env, logger = console, ...cliOptions }: StartCliOptions = {}
) => {
  const stdout = new Writable({
    write(chunk, encoding, callback) {
      logger.log(`[@tramvai/cli] log:`, chunk.toString());

      callback();
    },
  });
  const stderr = new Writable({
    write(chunk, encoding, callback) {
      logger.error(`[@tramvai/cli] error:`, chunk.toString());

      callback();
    },
  });

  const cliResult = await start({
    stdout,
    stderr,
    noClientRebuild: !enableRebuild,
    noServerRebuild: !enableRebuild,
    ...(typeof targetOrConfig === 'string'
      ? { target: targetOrConfig }
      : { config: targetOrConfig }),
    env: {
      ...env,
      MOCKER_ENABLED: 'true',
    },
    port: 0,
    staticPort: 0,
    ...cliOptions,
  });

  const serverUrl = getServerUrl(cliResult);
  const staticUrl = getStaticUrl(cliResult);
  const appName = typeof targetOrConfig === 'string' ? targetOrConfig : targetOrConfig.name;

  try {
    await waitOn({
      resources: [`${serverUrl}/readyz`],
    });
  } catch (e) {
    logger.error('[@tramvai/cli] /readyz wait failed:', e);
    throw e;
  }

  const request = requestFactory(serverUrl);
  const render = renderFactory(request);

  const papi = wrapPapi({
    serverUrl,
    appName,
  });

  const mocker = wrapMocker({ papi });

  return {
    ...cliResult,
    serverUrl,
    staticUrl,
    stdout,
    stderr,
    request,
    render,
    papi,
    mocker,
  };
};
export type StartCliResult = PromiseType<ReturnType<typeof startCli>>;
