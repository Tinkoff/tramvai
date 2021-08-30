import { commandLineListTokens } from '@tramvai/core';

const command = {
  init: [commandLineListTokens.init, commandLineListTokens.listen],
  close: [commandLineListTokens.close],
  customer: [
    commandLineListTokens.customerStart,
    commandLineListTokens.resolveUserDeps,
    commandLineListTokens.resolvePage,
    commandLineListTokens.resolvePageDeps,
    commandLineListTokens.generatePage,
    commandLineListTokens.clear,
  ],
  spa: [
    commandLineListTokens.resolveUserDeps,
    commandLineListTokens.resolvePageDeps,
    commandLineListTokens.spaTransition,
  ],
};

export const lines = {
  server: command,
  client: command,
};
