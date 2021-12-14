/**
 * @jest-environment jsdom
 */

import React, { useEffect, useRef } from 'react';
import { createReducer, createEvent, useStore } from '@tramvai/state';
import { useDi } from '@tramvai/react';
import { useRoute } from '@tinkoff/router';
import { testComponent } from './testComponent';

describe('test/unit/react/testComponent', () => {
  it('should render simple component', async () => {
    const Cmp = () => {
      return (
        <div>
          <div>Root</div>
          <div data-testid="test">Content</div>
        </div>
      );
    };

    const { render } = testComponent(<Cmp />);

    expect(render.getByTestId('test').textContent).toBe('Content');
  });

  it('should rerender component on store updates', async () => {
    const event = createEvent<void>('evnt');
    const store = createReducer('store', { a: 1 }).on(event, (state) => ({ a: state.a + 1 }));

    const Cmp = () => {
      const { a } = useStore(store);

      return (
        <div>
          <span data-testid="content">Counter: {a}</span>
        </div>
      );
    };

    const { context, render, act } = testComponent(<Cmp />, { stores: [store] });
    expect(render.getByTestId('content').textContent).toBe('Counter: 1');

    act(() => {
      context.dispatch(event());
    });

    expect(render.getByTestId('content').textContent).toBe('Counter: 2');
  });

  it('should work with di', async () => {
    const Cmp = () => {
      const { provider } = useDi({ provider: 'provider' });

      return <span role="text">{provider}</span>;
    };

    const { render } = testComponent(<Cmp />, {
      providers: [
        {
          provide: 'provider',
          useValue: 'test',
        },
      ],
    });

    expect(render.getByRole('text')).toMatchInlineSnapshot(`
      <span
        role="text"
      >
        test
      </span>
    `);
  });

  it('should work with routing', async () => {
    const Cmp = () => {
      const route = useRoute();

      return (
        <div>
          <div data-testid="route">
            <div data-testid="route-path">{route.actualPath}</div>
            <div data-testid="route-name">{route.name}</div>
          </div>
        </div>
      );
    };

    const { render } = testComponent(<Cmp />, { currentRoute: { name: 'test', path: '/test/' } });

    expect(render.getByTestId('route-path').textContent).toBe('/test/');
    expect(render.getByTestId('route-name').textContent).toBe('test');
  });

  it('should rerender simple component', async () => {
    expect.hasAssertions();

    const Cmp = ({ label }: { label: string }) => {
      const count = useRef(1);
      useEffect(() => {
        count.current += 1;
      }, [label]);
      return (
        <div>
          <div>Root</div>
          <div data-testid="test">{`${count.current}. ${label}`}</div>
        </div>
      );
    };

    const { render, rerender } = testComponent(<Cmp label="first render" />);
    expect(render.getByTestId('test').textContent).toBe('1. first render');

    rerender(<Cmp label="second render" />);
    expect(render.getByTestId('test').textContent).toBe('2. second render');
  });

  it('should rerender component on props updates', async () => {
    const event = createEvent<void>('evnt');
    const store = createReducer('store', { a: 1 }).on(event, (state) => ({ a: state.a + 1 }));

    const Cmp = ({ label }: { label: string }) => {
      const count = useRef(1);
      const { a } = useStore(store);
      useEffect(() => {
        count.current += 1;
      }, [label]);
      return (
        <div>
          <span data-testid="content">{`${count.current}. ${label}: ${a}`}</span>
        </div>
      );
    };

    const { context, render, rerender, act } = testComponent(<Cmp label="first render" />, {
      stores: [store],
    });
    expect(render.getByTestId('content').textContent).toBe('1. first render: 1');

    act(() => {
      context.dispatch(event());
    });
    expect(render.getByTestId('content').textContent).toBe('2. first render: 2');

    rerender(<Cmp label="second render" />);
    expect(render.getByTestId('content').textContent).toBe('2. second render: 2');
  });
});
