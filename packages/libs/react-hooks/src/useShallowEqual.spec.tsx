/**
 * @jest-environment jsdom
 */
import React, { useEffect, useReducer } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useShallowEqual } from './useShallowEqual';

describe('react-hooks/useShallowEqual', () => {
  it('should return function which accepts string', () => {
    const cb = jest.fn();
    const cbShallow = jest.fn();
    const Cmp = () => {
      const obj = { a: 1, b: 2 };
      const objRef = useShallowEqual(obj);
      const [, forceRender] = useReducer((s) => s + 1, 0);

      useEffect(cb, [obj]);
      useEffect(cbShallow, [objRef]);

      return <div onClick={forceRender}>Test</div>;
    };

    const { getByText } = render(<Cmp />);

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cbShallow).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText('Test'));

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cbShallow).toHaveBeenCalledTimes(1);
  });
});
