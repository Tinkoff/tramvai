import flatten from '@tinkoff/utils/array/flatten';
import React, { useMemo, useState, useCallback } from 'react';
import { useDi } from '@tramvai/react';
import { ROUTES_TOKEN, Link } from '@tramvai/module-router';
import styles from './styles.css';
// @ts-ignore
import image from './image.gif';
import logo from './logo.svg';

export const HeaderCmp = () => {
  const [isShowed, show] = useState(false);
  const { routes } = useDi({ routes: ROUTES_TOKEN });
  const urls = useMemo(() => {
    return flatten<typeof ROUTES_TOKEN>((routes as any) ?? []).map((route) => {
      return route.path;
    });
  }, [routes]);

  const onShow = useCallback(() => {
    show(!isShowed);
  }, [isShowed, show]);

  return (
    <header>
      <div>
        Tramvai Header{' '}
        <button type="button" onClick={onShow}>
          ShowLogo
        </button>
      </div>
      {isShowed && <img alt="logo" src={logo} />}
      <ul className={styles.menu}>
        {urls.map((url) => {
          return (
            <li key={url} className={styles.menu_item}>
              <Link url={url}>{url}</Link>
            </li>
          );
        })}
        <img src={image} alt="img" className={styles.menu_logo} />
      </ul>
      <hr />
    </header>
  );
};
