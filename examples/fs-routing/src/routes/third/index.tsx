import type { PageComponent } from '@tramvai/react';
import { useActions } from '@tramvai/state';

import { useState } from 'react';
import { navigateAction } from '../../actions/navigateAction';
import { Button } from '../../components/shared/Button/Button';

export const ThirdPage: PageComponent = () => {
  const [error, setError] = useState(false);

  // Привязываем экшен для навигации к стору
  const navigate = useActions(navigateAction);

  return (
    <div>
      There will be an error when you will click on the button 🤓
      <Button id="break-button" onClick={() => setError(true)}>
        break a leg!
      </Button>
      <Button onClick={() => navigate('/')}>to main page</Button>
      {error &&
        // @ts-ignore. Only for testing purpose
        ['better', 'late', 'than', 'never'].map((word) => <p key={word}>{word.nested.azaza}</p>)}
    </div>
  );
};

export default ThirdPage;
