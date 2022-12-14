import { Container } from '@tinkoff/dippy';
import type { ActionContext } from '@tramvai/core';

// @TODO: v3: leave only di container in next major
export const resolveDI = (diOrContext: ActionContext | Container) => {
  return diOrContext instanceof Container
    ? diOrContext
    : (diOrContext as unknown as { di: Container }).di;
};
