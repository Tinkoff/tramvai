import type { ExtendedModule, ModuleType, commandLineListTokens } from '@tramvai/core';
import { getModuleParameters, walkOfModules } from '@tramvai/core';
import type { Container } from '@tinkoff/dippy';
import { createMockDi } from '@tramvai/test-mocks';

type OptionsDi = Parameters<typeof createMockDi>[0];
type Options = OptionsDi & { di?: Container; modules?: Array<ModuleType | ExtendedModule> };

export const getDiWrapper = ({
  providers = [],
  modules = [],
  di = createMockDi(),
}: Options = {}) => {
  const resolvedModules = walkOfModules(modules);

  resolvedModules.forEach((mod) => {
    const moduleParameters = getModuleParameters(mod);

    moduleParameters.providers.forEach((provider) => {
      di.register(provider);
    });
  });

  if (providers) {
    providers.forEach((provider) => di.register(provider));
  }

  return {
    di,
    runLine: (line: typeof commandLineListTokens[keyof typeof commandLineListTokens]) => {
      const handlers = di.get({ token: line, multi: true });

      return Promise.all(handlers.map((handler) => handler()));
    },
  };
};
