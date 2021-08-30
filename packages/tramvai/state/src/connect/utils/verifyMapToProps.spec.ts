// danger, typescript
// без этого экспорта будет Cannot redeclare block-scoped variable 'mockDebug'.
export {};

const mockWarn = jest.fn();

jest.mock('../../logger', () => ({
  getLogger: () => ({
    warn: mockWarn,
  }),
}));

const { verifyMapToProps } = jest.requireActual('./verifyMapToProps');

describe('verifyMapToProps', () => {
  beforeEach(() => {
    mockWarn.mockClear();
  });

  it('should call mapToProps twice and if result is shallowEqual do not call debug', () => {
    const result = { a: 123 };
    const mapToProps = jest.fn(() => result);
    const newMapToProps = verifyMapToProps(mapToProps, 'test');
    const state = { state: true };
    const props = { props: true };

    expect(newMapToProps(state, props)).toEqual(result);
    expect(mapToProps).toHaveBeenCalledTimes(2);
    expect(mockWarn).not.toHaveBeenCalled();
  });

  it('should call mapToProps twice and if result is not shallowEqual should call debug', () => {
    let x = 0;
    const mapToProps = jest.fn(() => ({ a: x, b: 1234, c: x++ }));
    const newMapToProps = verifyMapToProps(mapToProps, 'test');
    const state = { state: true };
    const props = { props: true };

    expect(newMapToProps(state, props)).toEqual({ a: 1, b: 1234, c: 1 });
    expect(mapToProps).toHaveBeenCalledTimes(2);
    expect(mockWarn).toHaveBeenCalledWith(
      'Component "%s" recreate equal props %s',
      'test',
      '"a", "c"'
    );
  });
});
