import type { Argv, Options } from 'yargs';
import yargs from 'yargs';
import { cosmiconfigSync } from 'cosmiconfig';
import { Collector as WorkspacesCollector } from '@tinkoff-monorepo/pkgs-collector-workspaces';
import type { CollectorInterface } from '@tinkoff-monorepo/pkgs-collector';
import { getCollectorBy } from '@tinkoff-monorepo/pkgs-collector';
import omit from '@tinkoff/utils/object/omit';
import mergeDeep from '@tinkoff/utils/object/mergeDeep';
import { toLowerFirst } from './utils';
import type { Config } from './types';
import { logger } from './logger';

function throwConfigLoadError() {
  throw new Error(`Config load error`);
}

function getBaseConfigs(config: { extends?: string[] } = {}): Config[] {
  const explorer = cosmiconfigSync('depscheck', { stopDir: process.cwd() });
  const resolvedConfigs =
    // eslint-disable-next-line array-callback-return
    config.extends?.map((p) => {
      const res = explorer.load(p);
      if (res) {
        return res.config;
      }

      logger.fatal(`Base config not found by path ${p}`);
      throwConfigLoadError();
    }) ?? [];

  return resolvedConfigs
    .reduce((acc, cfg) => acc.concat(getBaseConfigs(cfg)), [])
    .concat(resolvedConfigs);
}

function extractConfig() {
  const args = addConfigOpt(yargs).help(false).argv;
  if (args.config === 'false') {
    return {};
  }

  let resultConfig;
  const explorer = cosmiconfigSync('depscheck', { stopDir: process.cwd() });
  if (args.config) {
    resultConfig = explorer.load(args.config)?.config;
    if (!resultConfig) {
      logger.fatal(`Config not found by path ${args.config}`);
      throwConfigLoadError();
    }
  } else {
    resultConfig = explorer.search()?.config ?? {};
  }

  if (resultConfig.extends) {
    const baseConfigs = getBaseConfigs(resultConfig);
    resultConfig = mergeDeep(...baseConfigs, resultConfig);
    delete resultConfig.extends;
  }

  return resultConfig;
}

function addConfigOpt(cli: typeof yargs) {
  return cli.option('config', {
    type: 'string',
    description: 'Path to the config (by default cosmiconfig is used)',
  });
}

function describeCollectorOption(usedCollector: string) {
  return `Module for collecting packages for depshcheck. Should implement interface @tinkoff-monorepo/pkgs-collector -> CollectorInterface (currently ${usedCollector} is used)`;
}

export function buildInitialCliAndExtractCollector() {
  const initialCli = addConfigOpt(yargs as Argv<Config>)
    .option('collector', {
      default: WorkspacesCollector,
      required: true,
      group: 'collector',
      description: describeCollectorOption(WorkspacesCollector.name),
    })
    .config(extractConfig());
  const { collector } = initialCli.argv;

  return getCollectorBy(collector);
}

export function buildResultCliWithCollectorOpts({ cliOpts, collect, name }: CollectorInterface) {
  let cli = addConfigOpt(yargs);

  if (cliOpts) {
    cli = cliOpts.reduce(
      (nextCli, opt: Options & { name: string }) =>
        nextCli.option(
          `collector-config-${toLowerFirst(opt.name)}`,
          omit(['name'], {
            ...opt,
            group: 'collector',
          })
        ),
      cli
    );
  }
  return cli
    .describe('collector', describeCollectorOption(name))
    .coerce('collector', () => collect)
    .strict();
}
