/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { LazyRender } from './lazy-render';
import { mockIntersectionObserver } from '../mocks/mock-intersection-observer';

jest.mock('./use-observer-visible', () => {
  return require('./use-observer-visible.browser');
});

const Content = ({ onClick }: { onClick?(): void }) => (
  <section>
    <h1 onClick={onClick}>Original markup</h1>
  </section>
);

describe('ProgressiveRenderer', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="root"><div><section><h1>Original markup</h1></section></div></div>';
  });

  afterEach(() => {
    const root = document.getElementById('root');
    ReactDOM.unmountComponentAtNode(root);
    mockIntersectionObserver.clear();
  });

  it('render original markup', () => {
    const root = document.getElementById('root');

    act(() => {
      ReactDOM.hydrate(
        <LazyRender>
          <Content />
        </LazyRender>,
        root
      );
    });

    expect(root.innerHTML).toMatchInlineSnapshot(
      `"<div><section><h1>Original markup</h1></section></div>"`
    );
  });

  it('custom observer mechanism', async () => {
    const root = document.getElementById('root');

    const useObserver = () => {
      const [isVisible, changeVisibility] = React.useState(false);
      React.useEffect(() => {
        setTimeout(() => changeVisibility(true), 0);
      });
      return isVisible;
    };

    act(() => {
      ReactDOM.hydrate(
        <LazyRender useObserver={useObserver}>
          <Content />
          Custom text
        </LazyRender>,
        root
      );
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(root.innerHTML).toMatchInlineSnapshot(
      `"<div><section><h1>Original markup</h1></section>Custom text</div>"`
    );
  });

  it('hydrate client markup on static mode', () => {
    const root = document.getElementById('root');
    const mockOnClick = jest.fn();

    act(() => {
      ReactDOM.hydrate(
        <LazyRender mode="static">
          <Content onClick={mockOnClick} />
        </LazyRender>,
        root
      );
    });

    const h1 = root.querySelector('h1');

    h1.click();

    expect(mockOnClick.mock.calls.length).toBe(1);
  });

  it('hydrate client markup when block is visible', () => {
    const root = document.getElementById('root');
    const mockOnClick = jest.fn();

    act(() => {
      ReactDOM.hydrate(
        <LazyRender>
          <Content onClick={mockOnClick} />
        </LazyRender>,
        root
      );
    });

    act(() => {
      mockIntersectionObserver.trigger([{ isIntersecting: true }]);
    });

    const h1 = root.querySelector('h1');

    h1.click();

    expect(mockOnClick.mock.calls.length).toBe(1);
  });

  it('prevent hydrate client markup when block is hidden', () => {
    const root = document.getElementById('root');
    const mockOnClick = jest.fn();

    act(() => {
      ReactDOM.hydrate(
        <LazyRender>
          <Content onClick={mockOnClick} />
        </LazyRender>,
        root
      );
    });

    act(() => {
      mockIntersectionObserver.trigger([{ isIntersecting: false }]);
    });

    const h1 = root.querySelector('h1');

    h1.click();

    expect(mockOnClick.mock.calls.length).toBe(0);
  });
});
