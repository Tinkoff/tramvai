// danger, typescript
// без этого экспорта будет Cannot redeclare block-scoped variable 'mockDebug'.
export {};

const mockDebug = jest.fn();

jest.mock('../../logger', () => ({
  getLogger: () => ({
    debug: mockDebug,
  }),
}));

const { verifyFunction } = jest.requireActual('./verifyFunction');

describe('verifyFunction', () => {
  it('should not call debug', () => {
    verifyFunction(() => {});
    verifyFunction(() => null);
    expect(mockDebug).not.toHaveBeenCalled();
  });

  it('should call debug', () => {
    verifyFunction({ a: 1, b: 2 });
    verifyFunction(Object.create(null));
    verifyFunction();
    expect(mockDebug).toHaveBeenCalledTimes(3);
  });
});
