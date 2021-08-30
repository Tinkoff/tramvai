import { createContainer } from './createContainer';
import { createToken } from '../createToken/createToken';

describe('createContainer', () => {
  it('проверка инициализации', () => {
    const token = createToken('logger');
    const container = createContainer();
    container.register({ provide: token, useValue: 'log' });

    expect(container.get(token)).toBe('log');
  });
});
