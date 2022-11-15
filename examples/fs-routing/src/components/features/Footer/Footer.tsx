import { usePageService } from '@tramvai/module-router';
import styles from './Footer.css';

export const Footer = () => {
  const pageService = usePageService();
  const ModalComponent = pageService.getComponent('modal');

  return (
    <div className={styles.footer}>
      <div>this Footer in fs-routing</div>
      <ModalComponent />
    </div>
  );
};
