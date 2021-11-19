import React from 'react';
import { useDi } from '@tramvai/react';
import { PAGE_SERVICE_TOKEN } from '@tramvai/tokens-router';
import styles from './Footer.css';

export const Footer = () => {
  const pageService = useDi(PAGE_SERVICE_TOKEN);
  const ModalComponent = pageService.getComponent('modal');

  return (
    <div className={styles.footer}>
      <div>this Footer in fs-routing</div>
      <ModalComponent />
    </div>
  );
};
