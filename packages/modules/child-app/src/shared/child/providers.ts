import type { Container } from '@tinkoff/dippy';
import type { Provider } from '@tramvai/core';
import { provide } from '@tramvai/core';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { RENDER_SLOTS } from '@tramvai/tokens-render';
import { getChildProviders as getChildEndProviders } from '../../server/child/providers';

export const getChildProviders = (appDi: Container): Provider[] => {
  const logger = appDi.get(LOGGER_TOKEN);

  return [
    provide({
      provide: LOGGER_TOKEN,
      useValue: Object.assign((opts) => {
        return logger('child-app').child(opts);
      }, logger),
    }),
    provide({
      provide: RENDER_SLOTS,
      multi: true,
      useValue: [],
    }),
    ...getChildEndProviders(appDi),
  ];
};
