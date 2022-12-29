import type { Container } from '@tinkoff/dippy';
import { createToken } from '@tinkoff/dippy';
import type { CommandLineDescription, CommandLines } from '@tramvai/tokens-core';

export type CommandLineTimingInfo = Record<
  keyof CommandLineDescription,
  {
    /**
     * Start of the line execution. Measured in milliseconds with performance.now
     */
    start: number;
    /**
     * End of the line execution. Measured in milliseconds with performance.now
     * If the value is empty for some lines it is implies line is still executing
     */
    end?: number;
  }
>;

export type CommandLineExecutionEndHandler = (
  di: Container,
  type: keyof CommandLines,
  status: keyof CommandLineDescription,
  timingInfo: CommandLineTimingInfo
) => void;

export const COMMAND_LINE_TIMING_INFO_TOKEN = createToken<CommandLineTimingInfo>(
  'commandLineRunner timingInfo'
);

export const COMMAND_LINE_EXECUTION_END_TOKEN = createToken<CommandLineExecutionEndHandler>(
  'commandLineRunner executionEnd',
  { multi: true }
);
