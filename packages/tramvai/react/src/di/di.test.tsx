/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { createToken, createContainer } from '@tinkoff/dippy';
import { DIContext } from './context';
import { withDi } from './hoc';
import { useDi } from './hooks';

const loggerToken = createToken<(message: string) => void>('logger');

const testFactory = (TestComponent: any) => {
  const result: any = [];
  const di = createContainer([
    {
      provide: loggerToken,
      useFactory: () => {
        result.push('create logger');
        return (message: string) => result.push(`run logger message ${message}`);
      },
    },
    {
      provide: 'components',
      useFactory: () => {
        result.push('create components');
        return () => {
          result.push('run components');
          return <div data-testid="text">Di text</div>;
        };
      },
    },
  ]);

  const testCase = () => (
    <DIContext.Provider value={di}>
      <TestComponent />
    </DIContext.Provider>
  );

  const { getByTestId, rerender } = render(testCase());
  expect(getByTestId('text')).toHaveTextContent('Di text');
  expect(result).toMatchInlineSnapshot(`
    [
      "create logger",
      "create components",
      "run logger message hello",
      "run components",
    ]
  `);

  rerender(testCase());

  expect(result).toMatchInlineSnapshot(`
    [
      "create logger",
      "create components",
      "run logger message hello",
      "run components",
      "run logger message hello",
      "run components",
    ]
  `);
};

describe('react di', () => {
  // eslint-disable-next-line jest/expect-expect
  it('useDi with object', async () => {
    testFactory(() => {
      const { logger, Text } = useDi({ logger: loggerToken, Text: 'components' });
      logger('hello');

      return <Text />;
    });
  });

  it('useDi with token optional', async () => {
    testFactory(() => {
      const logger = useDi({ token: loggerToken, optional: true });
      const Text = useDi({ token: 'components', optional: true });
      const empty = useDi({ token: 'random_token', optional: true });

      logger?.('hello');

      expect(empty).toBeNull();

      return <Text />;
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('useDi with single', async () => {
    testFactory(() => {
      const logger = useDi(loggerToken);
      const Text = useDi('components');
      logger('hello');

      return <Text />;
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('withDi', async () => {
    testFactory(
      withDi({ logger: loggerToken, Text: 'components' })(({ logger, Text }) => {
        logger('hello');

        return <Text />;
      })
    );
  });
});
