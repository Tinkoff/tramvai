/**
 * @jest-environment jsdom
 */
import React from 'react';
import { composeLayoutOptions } from './utils';

describe('composeLayoutOptions', () => {
  const createComponent = (name) => (props) => <div>{name}</div>;
  const createWrapper = (name) => (Wrapped) => (props) =>
    (
      <div className={name}>
        <Wrapped />
      </div>
    );

  it('should compose options list', () => {
    const c1 = createComponent('c1');
    const c2 = createComponent('c2');
    const c3 = createComponent('c3');
    const c4 = createComponent('c4');
    const w1 = createWrapper('w1');
    const w2 = createWrapper('w2');
    const w3 = createWrapper('w3');
    const w4 = createWrapper('w4');
    const w5 = createWrapper('w5');
    const list = [
      {
        components: {
          c1,
          c2,
        },
        wrappers: {
          c1: w1,
          c3: w3,
        },
      },
      {},
      {
        components: {
          c3,
          c1: c4,
        },
      },
      {
        wrappers: {
          c1: [w2],
          c2: [w4, w5],
        },
      },
    ];

    expect(composeLayoutOptions(list)).toEqual({
      components: {
        c1: c4,
        c2,
        c3,
      },
      wrappers: {
        c1: [w1, w2],
        c2: [w4, w5],
        c3: [w3],
      },
    });
  });
});
