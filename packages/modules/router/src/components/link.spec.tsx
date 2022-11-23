/**
 * @jest-environment jsdom
 */
import { testComponent } from '@tramvai/test-react';
import { createMockRouter } from '@tramvai/test-mocks';
import { Link } from './link';

describe('react/link', () => {
  const router = createMockRouter();

  jest.spyOn(router, 'navigate');

  const mount = (linkOptions) => {
    return testComponent(<Link data-testid="link" {...linkOptions} />, { router });
  };

  beforeEach(() => {
    (router.navigate as any).mockClear();
  });

  it('click on link should call router.navigate', () => {
    const {
      render: { getByTestId },
      fireEvent,
    } = mount({ url: '/test/' });

    expect(router.navigate).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('link'));

    expect(router.navigate).toHaveBeenCalledWith({ url: '/test/' });
  });

  it('click on link should call router.navigate 2', () => {
    const {
      render: { getByTestId },
      fireEvent,
    } = mount({
      url: '/abc/',
      query: { a: '1' },
      replace: true,
    });

    expect(router.navigate).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('link'));

    expect(router.navigate).toHaveBeenCalledWith({
      url: '/abc/',
      query: { a: '1' },
      replace: true,
    });
  });

  it('click on link with target should not call router', () => {
    const {
      render: { getByTestId },
      fireEvent,
    } = mount({ url: '/test/', target: '_blank' });

    expect(router.navigate).not.toHaveBeenCalled();

    fireEvent.click(getByTestId('link'));

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
