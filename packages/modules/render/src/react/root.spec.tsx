/**
 * @jest-environment jsdom
 */
import React from 'react';
import { DIContext } from '@tramvai/react';
import { testComponent } from '@tramvai/test-react';
import { waitRaf } from '@tramvai/test-jsdom';
import { LOGGER_TOKEN } from '@tramvai/module-common';
import { useRoute } from '@tramvai/module-router';
import { createMockDi } from '@tramvai/test-mocks';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import { provide } from '@tinkoff/dippy';
import { ComponentRegistry } from '../../../common/src/componentRegistry/componentRegistry';
import { PageService } from '../../../router/src/services/page';
import { Root } from './root';

jest.mock('@tramvai/module-router', () => ({
  useRoute: jest.fn(),
  usePageService: jest.requireActual('@tramvai/module-router').usePageService,
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

    const di = createMockDi({
      providers: [provide({ provide: PAGE_SERVICE_TOKEN, useValue: pageService })],
    });

    const { rerender } = testComponent(
      <DIContext.Provider value={di}>
        <Root />
      </DIContext.Provider>,
      {
        providers: [
          {
            provide: LOGGER_TOKEN,
            useValue: () => ({
              error: mockLog,
            }),
          },
        ],
      }
    );

    expect(mock).toHaveBeenCalledTimes(1);

    mockRoute.config = {
      layoutComponent: 'layout',
      pageComponent: 'page',
    };

    await waitRaf();
    await rerender(
      <DIContext.Provider value={di}>
        <Root />
      </DIContext.Provider>
    );
    expect(mock).toHaveBeenCalledTimes(1);

    mockRoute.config = {
      layoutComponent: 'layout2',
      pageComponent: 'page',
    };
    await waitRaf();
    await rerender(
      <DIContext.Provider value={di}>
        <Root />
      </DIContext.Provider>
    );
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
