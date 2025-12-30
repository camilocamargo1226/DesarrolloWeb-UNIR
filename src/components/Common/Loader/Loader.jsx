import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ message = 'Cargando...' }) => {
  return (
    <div className={styles.loader}>
      <div className={styles.loader__spinner}></div>
      <p className={styles.loader__message}>{message}</p>
    </div>
  );
};

export default Loader;