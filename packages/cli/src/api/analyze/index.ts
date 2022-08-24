import { createCommand } from '../../commands/createCommand';
import { ABSTRACT_BUILDER_FACTORY_TOKEN, COMMAND_PARAMETERS_TOKEN } from '../../di/tokens';
import { registerProviders } from '../../utils/di';
import { sharedProviders } from './providers/shared';

export interface Params {
  target: string;
  plugin?: 'bundle' | 'whybundled' | 'statoscope';
  modern?: boolean;
  showConfig?: boolean;
  fileCache?: boolean;
}

export type AnalyzeCommand = (params: Params) => Promise<void>;

export default createCommand({
  name: 'analyze',
  command: async (di): Promise<void> => {
    const { plugin, modern } = di.get(COMMAND_PARAMETERS_TOKEN) as Params;

    registerProviders(di, sharedProviders);

    const builderFactory = di.get(ABSTRACT_BUILDER_FACTORY_TOKEN);
    const builder = await builderFactory.createBuilder('webpack', {
      options: {
        shouldBuildClient: true,
        shouldBuildServer: false,
      },
    });

    await builder.analyze({ plugin, modern });
  },
});
