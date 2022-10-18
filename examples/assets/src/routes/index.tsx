import { useState } from 'react';
import { useIsomorphicLayoutEffect } from '@tinkoff/react-hooks';
import logo from '../images/logo.svg';
import Logo from '../images/logo.svg?react';

export const MainPage = () => {
  // prevent hydration mismatch error because it will break test case
  const [isServer, setIsServer] = useState(true);

  useIsomorphicLayoutEffect(() => {
    setIsServer(false);
  }, []);

  return (
    <div>
      <h2>Main Page</h2>

      <div>
        <p>Default svg:</p>
        {isServer && (
          <p key="server" dangerouslySetInnerHTML={{ __html: logo }} suppressHydrationWarning />
        )}
        {!isServer && (
          <p key="browser" dangerouslySetInnerHTML={{ __html: logo }} suppressHydrationWarning />
        )}
      </div>

      <div>
        <p>Svgr:</p>
        <p>
          <Logo width="100" height="100" />
        </p>
      </div>
    </div>
  );
};

export default MainPage;
