import type { Container } from '@tinkoff/dippy';
import type { Provider } from '@tramvai/core';
import { getChildProviders as getChildEndProviders } from '../../server/child/providers';

export const getChildProviders = (appDi: Container): Provider[] => {
  return getChildEndProviders(appDi);
};
