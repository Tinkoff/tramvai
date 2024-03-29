import { PageComponent } from '@tramvai/react';
import { useActions } from '@tramvai/state';
import { useUrl } from '@tramvai/module-router';
import { Button } from '../../components/shared/Button/Button';
import { navigateAction } from '../../actions/navigateAction';
import { bundleClientOnlyAction, bundleServerOnlyAction } from '../../actions/bundleActions';
import { SecondModal } from '../../components/features/Modal/second';

export const SecondPage: PageComponent = () => {
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
  modal: SecondModal,
};

export default SecondPage;
