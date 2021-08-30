import { createToken } from '@tinkoff/dippy';

export const STDOUT_TOKEN = createToken<NodeJS.WritableStream>('std out');
export const STDERR_TOKEN = createToken<NodeJS.WritableStream>('std err');
