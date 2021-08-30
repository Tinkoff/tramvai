import { createToken } from '@tinkoff/dippy';
import { useDi } from './hooks';

const loggerToken = createToken<(message: string) => void>('logger');

describe('react DI', () => {
  describe('useDi', () => {
    it('optional tokens', () => {
      const logger = useDi({ token: loggerToken, optional: true });

      // @ts-expect-error
      logger('hello');

      // @ts-expect-error
      logger?.(21421);

      logger?.('test');
    });
  });
});
