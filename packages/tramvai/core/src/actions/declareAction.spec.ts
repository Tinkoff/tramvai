import { declareAction } from './declareAction';

describe('declareAction', () => {
  it('base', async () => {
    const action = declareAction({
      name: 'testAction',
      fn: jest.fn(),
    });

    expect({ ...action }).toMatchObject({
      name: 'testAction',
      fn: expect.any(Function),
    });
  });
});
