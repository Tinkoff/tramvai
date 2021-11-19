import type { PropsWithChildren } from 'react';
import React from 'react';
import { useActions } from '@tramvai/state';
import { useUrl } from '@tramvai/module-router';
import { Button } from '../components/shared/Button/Button';
import { navigateAction } from '../actions/navigateAction';
import { bundleClientOnlyAction, bundleServerOnlyAction } from '../actions/bundleActions';

export const SecondPage = () => {
  // Получаем текущий роут
  const currentPath = useUrl().path;
  // Привязываем экшен для навигации к стору
  const navigate = useActions(navigateAction);

  return (
    <div>
      Current route is <b>{currentPath}</b>{' '}
      <Button onClick={() => navigate('/')}>to main page</Button>
      <Button onClick={() => navigate('/old')}>to old page</Button>
    </div>
  );
};

SecondPage.actions = [bundleServerOnlyAction, bundleClientOnlyAction];

SecondPage.components = {
  // этот компонент можно будет использовать в качестве layout для текущей страницы
  'second-page/layout': ({ children }: PropsWithChildren<{}>) => (
    <main>
      <div>Second Page Header</div>
      {children}
      <div>Second Page Footer</div>
    </main>
  ),
};

export default SecondPage;
