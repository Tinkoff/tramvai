import type { LogEvent, Logger } from '../../../models/logger';

export const handleServerOutput = (logger: Logger, chunk: Buffer) => {
  const data = chunk.toString('utf-8');
  let type: LogEvent['type'] = 'info';
  let message: LogEvent['message'] = data;
  let payload: LogEvent['payload'] = data;

  try {
    const parsed: LogEvent = JSON.parse(data);

    type = parsed.type;

    if (parsed.message) {
      message = parsed.message;
    } else {
      payload = '';
    }
  } catch (error) {}

  logger.event({
    event: 'COMMAND:STATIC:SERVER',
    type,
    message,
    payload,
  });
};
