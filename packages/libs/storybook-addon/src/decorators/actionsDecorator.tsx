import { useEffect } from 'react';
import type { Action } from '@tramvai/core';
import { useDi } from '@tramvai/react';
import { ACTION_EXECUTION_TOKEN } from '@tramvai/tokens-common';

export interface ActionsDecoratorParameters {
  actions?: Action[];
}

export const ActionsDecorator = (
  Story,
  { parameters }: { parameters: ActionsDecoratorParameters }
) => {
  const actionExecution = useDi(ACTION_EXECUTION_TOKEN);

  useEffect(() => {
    if (parameters.actions) {
      parameters.actions.forEach((action) => {
        // @ts-expect-error
        actionExecution.run(action, undefined, 'global');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Story />;
};
