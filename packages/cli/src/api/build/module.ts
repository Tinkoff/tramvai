import type { Container } from '@tinkoff/dippy';
import type { Result } from './index';
import { sharedProviders } from './providers/shared';
import { registerProviders } from '../../utils/di';
import { ABSTRACT_BUILDER_FACTORY_TOKEN, CONFIG_MANAGER_TOKEN } from '../../di/tokens';

export const buildModule = async (di: Container): Result => {
  registerProviders(di, [...sharedProviders]);

  const configManager = di.get(CONFIG_MANAGER_TOKEN);

  const builderFactory = di.get(ABSTRACT_BUILDER_FACTORY_TOKEN);
  const builder = await builderFactory.createBuilder('webpack', {
    options: {
      shouldBuildClient: true,
      shouldBuildServer: true,
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
