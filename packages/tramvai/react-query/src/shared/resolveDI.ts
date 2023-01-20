import type { Container } from '@tinkoff/dippy';
import type { ActionContext } from '@tramvai/core';

const isActionContext = (
  diOrContext: ActionContext | Container
): diOrContext is ActionContext & { di: Container } => {
  return 'di' in diOrContext;
};

// @TODO: v3: leave only di container in next major
export const resolveDI = (diOrContext: ActionContext | Container): Container => {
  if (isActionContext(diOrContext)) {
    return diOrContext.di;
  }

  return diOrContext as Container;
};
