import { createToken } from '@tinkoff/dippy';
import type { Mocker, MockRepository } from '@tinkoff/mocker';

export interface MockerOptions {
  apis: string[];
}

export const MOCKER = createToken<Mocker>('MOCKER');

export const MOCKER_REPOSITORY = createToken<MockRepository[]>('MOCKER_REPOSITORY', {
  multi: true,
});

export const MOCKER_CONFIGURATION = createToken<() => Promise<MockerOptions>>(
  'MOCKER_CONFIGURATION'
);
