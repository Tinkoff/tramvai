import { useNavigate } from '@tramvai/module-router';
import { declareAction } from '@tramvai/core';
import { COOKIE_MANAGER_TOKEN } from '@tramvai/module-common';
import { Button } from '../../components/shared/Button/Button';

const clientAuthAction = declareAction({
  name: 'clientAuthAction',
  fn() {
    this.deps.cookieManager.set({ name: 'test-auth-client', value: 'true' });
  },
  deps: {
    cookieManager: COOKIE_MANAGER_TOKEN,
  },
  conditions: {
    onlyBrowser: true,
  },
});

export const AuthClientPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      Auth Client Page <Button onClick={() => navigate('/')}>to main page</Button>
    </div>
  );
};

AuthClientPage.actions = [clientAuthAction];

export default AuthClientPage;
