import { useEffect } from 'react';
import type { Action } from '@tramvai/core';
import { useDi } from '@tramvai/react';
import { ACTION_EXECUTION_TOKEN } from '@tramvai/tokens-common';
import type { StorybookDecorator } from '../types';

export interface ActionsDecoratorParameters {
  tramvai?: {
    actions?: Action[];
  };
}

export const ActionsDecorator: StorybookDecorator<ActionsDecoratorParameters> = (
  Story,
  { parameters }: { parameters: ActionsDecoratorParameters }
) => {
  const actionExecution = useDi(ACTION_EXECUTION_TOKEN);

  useEffect(() => {
    if (parameters.tramvai?.actions) {
      parameters.tramvai.actions.forEach((action) => {
        // @ts-expect-error
        actionExecution.run(action, undefined, 'global');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Story />;
};
