import type { Container } from '@tinkoff/dippy';
import type { Params, Result } from './index';
import {
  ABSTRACT_BUILDER_FACTORY_TOKEN,
  COMMAND_PARAMETERS_TOKEN,
  CONFIG_MANAGER_TOKEN,
} from '../../di/tokens';
import { sharedProviders } from './providers/shared';
import { registerProviders } from '../../utils/di';

export const buildApplication = async (di: Container): Result => {
  const options = di.get(COMMAND_PARAMETERS_TOKEN as Params);
  const { buildType } = options;

  const shouldBuildClient = buildType !== 'server';
  const shouldBuildServer = buildType !== 'client';

  registerProviders(di, sharedProviders);

  const configManager = di.get(CONFIG_MANAGER_TOKEN);

  const builderFactory = di.get(ABSTRACT_BUILDER_FACTORY_TOKEN);
  const builder = await builderFactory.createBuilder('webpack', {
    options: {
      shouldBuildClient,
      shouldBuildServer,
    },
  });

  const builderBuild = await builder.build({
    modern: configManager.modern,
  });

  return {
    builder,
    ...builderBuild,
  };
};
