import { Container } from '@tinkoff/dippy';
import { createMockDi } from './di';

describe('test/unit/mocks/di', () => {
  it('should create mock di container', () => {
    const di = createMockDi();

    expect(di).toBeInstanceOf(Container);
  });
});
