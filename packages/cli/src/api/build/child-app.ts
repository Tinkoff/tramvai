import type { Container } from '@tinkoff/dippy';
import type { Result } from './index';
import { sharedProviders } from './providers/shared';
import { registerProviders } from '../../utils/di';
import { ABSTRACT_BUILDER_FACTORY_TOKEN } from '../../di/tokens';

export const buildChildApp = async (di: Container): Result => {
  registerProviders(di, sharedProviders);

  const builderFactory = di.get(ABSTRACT_BUILDER_FACTORY_TOKEN);
  const builder = await builderFactory.createBuilder('webpack', {
    options: {
      shouldBuildClient: true,
      shouldBuildServer: true,
    },
  });

  const builderBuild = await builder.build({
    // child-app either should be built for legacy code always
    // or should be smart loaded depending on browser capabilities
    modern: false,
  });

  return {
    builder,
    ...builderBuild,
  };
};
