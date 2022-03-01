import React from 'react';
import { Button } from '../../components/shared/Button/Button';
import { useNavigate } from '@tramvai/module-router';

export const SecondPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      Second Page <Button onClick={() => navigate('/')}>to main page</Button>
    </div>
  );
};

SecondPage.renderMode = 'client';

export default SecondPage;
