import {
  wrapMapToPropsConstant,
  wrapMapToPropsFunc,
  getDependsOnOwnProps,
  wrapMapToPropsObject,
} from './wrapMapToProps';

describe('connect/wrapMapToProps', () => {
  describe('wrapMapToPropsConstant', () => {
    it('should return constant function', () => {
      const c = jest.fn(() => '_const');
      const f = wrapMapToPropsConstant(c);
      const context: any = { a: 'A' };
      const options: any = { test: '123' };

      expect(typeof f).toBe('function');
      const g = f(context, options);

      expect(typeof g).toBe('function');
      expect((g as any).dependsOnOwnProps).toBeFalsy();
      expect(c).toHaveBeenCalledWith(context, options);
      expect(g()).toBe('_const');
    });
  });

  describe('getDependsOnOwnProps', () => {
    it('should return dependsOnOwnProps if set', () => {
      const c = () => {};

      c.dependsOnOwnProps = false;
      expect(getDependsOnOwnProps(c)).toBe(false);
      c.dependsOnOwnProps = true;
      expect(getDependsOnOwnProps(c)).toBe(true);
    });

    it('should return true if func.length !== 1', () => {
      let c: Function = () => {};

      expect(getDependsOnOwnProps(c)).toBeTruthy();
      c = (a, b) => {};
      expect(getDependsOnOwnProps(c)).toBeTruthy();
      c = (...args) => {};
      expect(getDependsOnOwnProps(c)).toBeTruthy();
    });

    it('should return false if func.length === 1', () => {
      const c = (a) => {};

      expect(getDependsOnOwnProps(c)).toBeFalsy();
    });
  });

  describe('wrapMapToPropsFunc', () => {
    const context: any = { a: 'A' };
    const state = { a: '1', b: '2' };
    const props = { p: '1' };
    const options = { displayName: '123' };

    const getWrapper = (c) => {
      const f = wrapMapToPropsFunc(c, 'someMethod');

      expect(typeof f).toBe('function');
      return f(context, options);
    };

    it('func is depends on own props', () => {
      const c = jest.fn(() => '_func');
      const f = getWrapper(c);

      expect(typeof f).toBe('function');
      expect(f.dependsOnOwnProps).toBeTruthy();
      expect(f(state, props)).toBe('_func');
      expect(c).toHaveBeenCalledWith(state, props);
      expect(f.dependsOnOwnProps).toBeTruthy();
    });

    it('func is not depends on own props', () => {
      const c = jest.fn((a) => '_funcaaa');
      const f = getWrapper(c);

      expect(typeof f).toBe('function');
      expect(f.dependsOnOwnProps).toBeTruthy();
      expect(f(state, props)).toBe('_funcaaa');
      expect(c).toHaveBeenCalledWith(state, undefined);
      expect(f.dependsOnOwnProps).toBeFalsy();
    });

    it('if mapToProps returns function use it as mapToProps', () => {
      const d = jest.fn((a) => '_funcbbb');
      const c = jest.fn(() => d);
      const f = getWrapper(c);

      expect(typeof f).toBe('function');
      expect(f.dependsOnOwnProps).toBeTruthy();
      expect(f(state, props)).toBe('_funcbbb');
      expect(c).toHaveBeenCalledWith(state, props);
      expect(d).toHaveBeenCalledWith(state, undefined);
      expect(f.dependsOnOwnProps).toBeFalsy();
    });
  });

  describe('wrapMapToPropsObject', () => {
    const executeAction = jest.fn();
    const context: any = { a: 'A', executeAction };
    const options = { displayName: 'options name' };

    it('should wrap actions in object to executeAction of actions', () => {
      const action = jest.fn();
      const params = { a: 1 };
      const wrapped = wrapMapToPropsObject({ action });

      expect(typeof wrapped).toBe('function');
      const initialized = wrapped(context, options);

      expect(typeof initialized).toBe('function');
      expect((initialized as any).dependsOnOwnProps).toBeFalsy();
      const props = initialized();
      const propsValues = Object.keys(props);

      expect(propsValues).toHaveLength(1);
      expect(propsValues).toContain('action');

      props.action(params);
      expect(executeAction).toHaveBeenCalledWith(action, params);
    });
  });
});
