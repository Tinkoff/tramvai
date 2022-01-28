/**
 * @jest-environment jsdom
 */
import React from 'react';
import { testComponent } from '@tramvai/test-react';
import { testChildApp } from './testChildApp';
import BaseChildApp, { CHILD_APP_BASE_TOKEN } from './__fixtures__/base';

describe('test/childApp/testChildApp', () => {
  it('base test', async () => {
    const {
      childApp: { di, Component },
      close,
    } = await testChildApp(BaseChildApp);
    const { render, rerender } = testComponent(
      <Component di={di} props={{ fromRoot: 'test123' }} />
    );

    expect(render.getByTestId('token').textContent).toBe("Children App: I'm little child app");
    expect(render.getByTestId('from-root').textContent).toBe('Value from Root: test123');

    expect(di.get(CHILD_APP_BASE_TOKEN)).toBe("I'm little child app");

    rerender(<Component di={di} props={{ fromRoot: 'root' }} />);

    expect(render.getByTestId('from-root').textContent).toBe('Value from Root: root');

    return close();
  });
});
