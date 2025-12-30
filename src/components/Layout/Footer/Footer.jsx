import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <p className={styles.footer__text}>
          © 2025 Relatos de Papel. Powered by G91. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;