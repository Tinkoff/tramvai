import React, { useCallback, useState } from 'react';
import { lazy } from '@tramvai/react';

// @ts-ignore
import styles from './page.css';

const InnerPageInitial = lazy(() => import('./InnerPageInitial'));
// отдельный компонент который не рендерится на сервере, а загружается только при клике на кнопку
const InnerPageOnClick = lazy(() => import('./InnerPageOnClick'));

export default function Page() {
  const [showed, show] = useState(false);
  const cb = useCallback(() => {
    show(!showed);
  }, [showed]);

  return (
    <div className={styles.page}>
      <div>Async Component</div>
      <InnerPageInitial />
      <div id="root-test" className={styles.content}>
        Test Root
      </div>
      <button id="root-button-show" type="button" onClick={cb}>
        {showed ? 'Hide' : 'Show'}
      </button>
      {showed && <InnerPageOnClick />}
    </div>
  );
}
