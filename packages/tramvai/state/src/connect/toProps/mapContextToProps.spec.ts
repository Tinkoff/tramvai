const mockFunc = jest.fn(() => '_func');
const mockConst = jest.fn(() => '_const');
const mockObject = jest.fn(() => '_object');

jest.mock('@tinkoff/utils/function/always', () => () => '_uniqueId');
jest.mock('./wrapMapToProps', () => ({
  wrapMapToPropsFunc: mockFunc,
  wrapMapToPropsConstant: mockConst,
  wrapMapToPropsObject: mockObject,
}));

describe('connect/mapContextToProps', () => {
  beforeEach(() => {
    mockFunc.mockClear();
    mockConst.mockClear();
    mockObject.mockClear();
  });

  it('default export is array', () => {
    expect(jest.requireActual('./mapContextToProps').mapContextToPropsFactories).toHaveLength(3);
  });

  describe('whenMapContextToPropsIsFunction', () => {
    const tst = jest.requireActual('./mapContextToProps').whenMapContextToPropsIsFunction;

    it('should calls wrap if mapContext is function', () => {
      const map = () => {};

      expect(tst(map)).toBe('_func');
      expect(mockFunc).toHaveBeenCalledWith(map, 'mapContextToProps');
    });

    it('should return undefined otherwise', () => {
      expect(tst()).toBeUndefined();
      expect(tst({})).toBeUndefined();
      expect(tst(/fawfwf/)).toBeUndefined();
      expect(tst('fawffffg')).toBeUndefined();
      expect(mockFunc).not.toHaveBeenCalled();
    });
  });

  describe('whenMapContextToPropsIsMissing', () => {
    const tst = jest.requireActual('./mapContextToProps').whenMapContextToPropsIsMissing;

    it('should calls wrap with identity function if mapContext is falsy', () => {
      expect(tst()).toBe('_const');
      expect(mockConst).toHaveBeenCalledWith('_uniqueId');
    });

    it('should return undefined otherwise', () => {
      expect(tst(() => {})).toBeUndefined();
      expect(tst({})).toBeUndefined();
      expect(tst(/fawfwf/)).toBeUndefined();
      expect(tst('fawffffg')).toBeUndefined();
      expect(mockFunc).not.toHaveBeenCalled();
    });
  });

  describe('whenMapContextToPropsIsObject', () => {
    const tst = jest.requireActual('./mapContextToProps').whenMapContextToPropsIsObject;
    const map = {};

    it('should calls wrap with identity function if mapContext is object', () => {
      expect(tst(map)).toBe('_object');
      expect(mockObject).toHaveBeenCalledWith(map);
    });

    it('should return undefined otherwise', () => {
      expect(tst()).toBeUndefined();
      expect(tst(() => {})).toBeUndefined();
      expect(tst('fawffffg')).toBeUndefined();
      expect(mockFunc).not.toHaveBeenCalled();
    });
  });
});
