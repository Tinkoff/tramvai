/**
 * @jest-environment jsdom
 */
import React from 'react';
import { testComponent } from '@tramvai/test-react';
import { waitRaf } from '@tramvai/test-jsdom';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { useRoute } from '@tramvai/module-router';
import { ComponentRegistry } from '../../../common/src/componentRegistry/componentRegistry';
import { Root } from './root';

jest.mock('@tramvai/module-router', () => ({
  useRoute: jest.fn(),
}));

let updateState;

(useRoute as any).mockImplementation(() => {
  const [route, setState] = React.useState({
    config: {
      layoutComponent: 'layout',
      pageComponent: 'page',
    },
  });

  updateState = setState;

  return route;
});

const mockLog = jest.fn();

describe('react/root', () => {
  it('should memoize wrapper function', async () => {
    const mock = jest.fn();
    class Layout extends React.Component<any, any> {
      constructor(props) {
        super(props);
        mock();
      }

      render() {
        return 'cmp';
      }
    }
    class Layout2 extends Layout {}
    const Page = () => <div />;

    const componentRegistry = new ComponentRegistry();
    componentRegistry.add('layout', Layout);
    componentRegistry.add('layout2', Layout2);
    componentRegistry.add('page', Page);

    testComponent(<Root componentRegistry={componentRegistry} />, {
      providers: [
        {
          provide: LOGGER_TOKEN,
          useValue: () => ({
            error: mockLog,
          }),
        },
      ],
    });

    expect(mock).toHaveBeenCalledTimes(1);

    updateState({
      config: {
        layoutComponent: 'layout',
        pageComponent: 'page',
      },
    });

    await waitRaf();
    expect(mock).toHaveBeenCalledTimes(1);
    updateState({
      config: {
        layoutComponent: 'layout2',
        pageComponent: 'page',
      },
    });
    await waitRaf();
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
