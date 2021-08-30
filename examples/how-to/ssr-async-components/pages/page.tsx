import React, { useCallback, useState } from 'react';
import { lazy } from '@tramvai/react';

// @ts-ignore
import styles from './page.css';

// отдельный компонент который не рендерится на сервере, а загружается только при клике на кнопку
const Loading = lazy(() => import('./innerPage'));

export default function Page() {
  const [showed, show] = useState(false);
  const cb = useCallback(() => {
    show(!showed);
  }, [showed]);

  return (
    <div className={styles.page}>
      <div>Async Component</div>
      <button type="button" onClick={cb}>
        Show
      </button>
      {showed && <Loading />}
    </div>
  );
}
