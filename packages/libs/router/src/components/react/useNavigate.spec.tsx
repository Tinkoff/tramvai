/**
 * @jest-environment jsdom
 */
import React from 'react';
import { createMockRouter } from '@tramvai/test-mocks';
import { testComponent } from '@tramvai/test-react';
import { useNavigate } from '@tinkoff/router';

describe('react/useNavigate', () => {
  const router = createMockRouter();

  jest.spyOn(router, 'navigate');

  beforeEach(() => {
    (router.navigate as jest.Mock).mockClear();
  });

  it('should return function which accepts string', () => {
    const Cmp = () => {
      const navigate = useNavigate();

      return <div onClick={() => navigate('/test/')}>Test</div>;
    };

    const {
      render: { getByText },
      fireEvent,
    } = testComponent(<Cmp />, { router });

    expect(router.navigate).not.toHaveBeenCalled();

    fireEvent.click(getByText('Test'));

    expect(router.navigate).toHaveBeenCalledWith({ url: '/test/' });
  });

  it('should return function which accepts object', () => {
    const Cmp = () => {
      const navigate = useNavigate();

      return (
        <div onClick={() => navigate({ url: '/123/', query: { a: '1', b: 'bbb' } })}>Test</div>
      );
    };

    const {
      render: { getByText },
      fireEvent,
    } = testComponent(<Cmp />, { router });

    expect(router.navigate).not.toHaveBeenCalled();

    fireEvent.click(getByText('Test'));

    expect(router.navigate).toHaveBeenCalledWith({
      url: '/123/',
      query: { a: '1', b: 'bbb' },
    });
  });

  it('should return function which accepts no arguments', () => {
    const Cmp = () => {
      const navigate = useNavigate({ url: '/abc/', replace: true });

      return <div onClick={navigate}>Test</div>;
    };

    const {
      render: { getByText },
      fireEvent,
    } = testComponent(<Cmp />, { router });

    expect(router.navigate).not.toHaveBeenCalled();

    fireEvent.click(getByText('Test'));

    expect(router.navigate).toHaveBeenCalledWith({ url: '/abc/', replace: true });
  });
});
