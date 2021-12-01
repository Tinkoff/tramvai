import React from 'react';
import { useActions } from '@tramvai/state';
import { useUrl } from '@tramvai/module-router';
import { navigateAction } from '../actions/navigateAction';
import { bundleClientOnlyAction, bundleServerOnlyAction } from '../actions/bundleActions';
import { Button } from './shared/Button/Button';

export const OldPage = () => {
  // Получаем текущий роут
  const currentPath = useUrl().path;
  // Привязываем экшен для навигации к стору
  const navigate = useActions(navigateAction);

  return (
    <div>
      Current route is <b>{currentPath}</b>{' '}
      <Button onClick={() => navigate('/')}>to main page</Button>
      <Button onClick={() => navigate('/second/')}>to second page</Button>
    </div>
  );
};

OldPage.actions = [bundleServerOnlyAction, bundleClientOnlyAction];

export default OldPage;
