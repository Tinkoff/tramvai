import { useNavigate } from '@tramvai/module-router';
import type { PageComponent } from '@tramvai/react';
import { Button } from '../../components/shared/Button/Button';

export const StaticSecondPage: PageComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      Static Second Page <Button onClick={() => navigate('/')}>to main page</Button>
    </div>
  );
};

StaticSecondPage.renderMode = 'static';

export default StaticSecondPage;
