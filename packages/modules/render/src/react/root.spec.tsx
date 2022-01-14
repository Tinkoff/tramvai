/**
 * @jest-environment jsdom
 */
import React from 'react';
import { testComponent } from '@tramvai/test-react';
import { waitRaf } from '@tramvai/test-jsdom';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { useRoute } from '@tramvai/module-router';
import { ComponentRegistry } from '../../../common/src/componentRegistry/componentRegistry';
import { PageService } from '../../../router/src/services/page';
import { Root } from './root';

jest.mock('@tramvai/module-router', () => ({
  useRoute: jest.fn(),
}));

const mockRoute = {
  config: {
    layoutComponent: 'layout',
    pageComponent: 'page',
  },
};

const mockRouter = {
  getCurrentRoute: () => mockRoute,
};

(useRoute as any).mockImplementation(() => {
  return mockRoute;
});
const mockLog = jest.fn();

describe('react/root', () => {
  it('should memoize wrapper function', async () => {
    const mock = jest.fn();
    class Layout extends React.Component<any, any> {
      constructor(props: any) {
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

    const pageService = new PageService({ componentRegistry, router: mockRouter });

    const { rerender } = testComponent(<Root pageService={pageService} />, {
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

    mockRoute.config = {
      layoutComponent: 'layout',
      pageComponent: 'page',
    };

    await waitRaf();
    await rerender(<Root pageService={pageService} />);
    expect(mock).toHaveBeenCalledTimes(1);

    mockRoute.config = {
      layoutComponent: 'layout2',
      pageComponent: 'page',
    };
    await waitRaf();
    await rerender(<Root pageService={pageService} />);
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
