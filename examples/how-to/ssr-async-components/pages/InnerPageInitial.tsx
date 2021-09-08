import React from 'react';
import styles from './InnerPageInitial.css';

export default function InnerPageInitial() {
  return (
    <div id="inner-page-initial" className={styles.page}>
      <h3>Inner Page Initial</h3>
      <span>subtitle</span>
      <div className={styles.content}>Some Content</div>
    </div>
  );
}
