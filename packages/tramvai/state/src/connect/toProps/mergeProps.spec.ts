describe('connect/mergeProps', () => {
  it('default export is array', () => {
    expect(jest.requireActual('./mergeProps').mergePropsFactories).toHaveLength(2);
  });

  describe('whenMergePropsIsFunction', () => {
    const tst = jest.requireActual('./mergeProps').whenMergePropsIsFunction;
    const context = {};
    const displayName = 'test';
    const stateProps = { state: 1 };
    const contextProps = { context: 2 };
    const ownProps = { own: 3 };

    it('should calls wrap if mergeProps is function', () => {
      let counter = 0;
      const mergeProp = jest.fn(() => counter++);
      const initMerge = tst(mergeProp);
      const areMergedPropsEqual = jest.fn();
      const pure = true;
      const finalMerge = initMerge(context, { displayName, pure, areMergedPropsEqual });

      expect(finalMerge(stateProps, contextProps, ownProps)).toBe(0);
      expect(mergeProp).toHaveBeenCalledWith(stateProps, contextProps, ownProps);
      expect(areMergedPropsEqual).not.toHaveBeenCalled();
      expect(finalMerge(stateProps, contextProps, ownProps)).toBe(1);
      expect(mergeProp).toHaveBeenCalledTimes(2);
      expect(areMergedPropsEqual).toHaveBeenCalledWith(1, 0);
    });

    it('if pure is false do not call areMergedPropsEqual', () => {
      let counter = 0;
      const mergeProp = jest.fn(() => counter++);
      const initMerge = tst(mergeProp);
      const areMergedPropsEqual = jest.fn(() => true);
      const pure = false;
      const finalMerge = initMerge(context, { displayName, pure, areMergedPropsEqual });

      expect(finalMerge(stateProps, contextProps, ownProps)).toBe(0);
      expect(areMergedPropsEqual).not.toHaveBeenCalled();
      expect(finalMerge(stateProps, contextProps, ownProps)).toBe(1);
      expect(areMergedPropsEqual).not.toHaveBeenCalled();
    });

    it('if pure is true and areMergedPropsEqual do not update props', () => {
      let counter = 0;
      const mergeProp = jest.fn(() => counter++);
      const initMerge = tst(mergeProp);
      const areMergedPropsEqual = jest.fn(() => true);
      const pure = true;
      const finalMerge = initMerge(context, { displayName, pure, areMergedPropsEqual });

      expect(finalMerge(stateProps, contextProps, ownProps)).toBe(0);
      expect(areMergedPropsEqual).not.toHaveBeenCalled();
      expect(finalMerge(stateProps, contextProps, ownProps)).toBe(0);
      expect(areMergedPropsEqual).toHaveBeenCalledWith(1, 0);
      expect(finalMerge(stateProps, contextProps, ownProps)).toBe(0);
    });

    it('should return undefined otherwise', () => {
      expect(tst()).toBeUndefined();
      expect(tst({})).toBeUndefined();
      expect(tst(/fawfwf/)).toBeUndefined();
      expect(tst('fawffffg')).toBeUndefined();
    });
  });

  describe('whenMergePropsIsOmitted', () => {
    const tst = jest.requireActual('./mergeProps').whenMergePropsIsOmitted;

    it('should return defaultMerge', () => {
      expect(tst()()({ a: 1, c: 2 }, { b: 2, d: 6 }, { a: 3, b: 3 })).toEqual({
        a: 1,
        b: 2,
        c: 2,
        d: 6,
      });
    });

    it('should return undefined otherwise', () => {
      expect(tst(() => {})).toBeUndefined();
      expect(tst({})).toBeUndefined();
      expect(tst(/fawfwf/)).toBeUndefined();
      expect(tst('fawffffg')).toBeUndefined();
    });
  });
});
