import { useNavigate } from '@tramvai/module-router';
import type { PageComponent } from '@tramvai/react';
import { Button } from '../../components/shared/Button/Button';

export const StaticPage: PageComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      Static Page <Button onClick={() => navigate('/')}>to main page</Button>
    </div>
  );
};

StaticPage.renderMode = 'static';

export default StaticPage;
