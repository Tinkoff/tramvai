import type { PageComponent } from '@tramvai/react';
import { useNavigate } from '@tramvai/module-router';
import { Button } from '../components/shared/Button/Button';

import './index.module.css';

export const MainPageRenderFallback = () => <div>Main Page loading...</div>;

export const MainPage: PageComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      Main Page <Button onClick={() => navigate('/second/')}>to second page</Button>
    </div>
  );
};

MainPage.components = {
  pageRenderFallbackDefault: MainPageRenderFallback,
};

MainPage.renderMode = 'client';

export default MainPage;
