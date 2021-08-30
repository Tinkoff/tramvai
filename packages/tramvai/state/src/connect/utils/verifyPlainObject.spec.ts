// danger, typescript
// без этого экспорта будет Cannot redeclare block-scoped variable 'mockDebug'.
export {};

const mockDebug = jest.fn();

jest.mock('../../logger', () => ({
  getLogger: () => ({
    debug: mockDebug,
  }),
}));

const { verifyPlainObject } = jest.requireActual('./verifyPlainObject');

describe('verifyPlainObject', () => {
  it('should not call debug', () => {
    verifyPlainObject({ a: 1, b: 2 });
    verifyPlainObject(Object.create(null));
    verifyPlainObject({});
    expect(mockDebug).not.toHaveBeenCalled();
  });

  it('should call debug', () => {
    verifyPlainObject(new (function Test() {})());
    verifyPlainObject(/test/);
    verifyPlainObject(new Date());
    expect(mockDebug).toHaveBeenCalledTimes(3);
  });
});
