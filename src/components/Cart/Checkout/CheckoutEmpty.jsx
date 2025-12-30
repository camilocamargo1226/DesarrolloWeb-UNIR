import React from 'react';
import styles from './Checkout.module.css';

const CheckoutEmpty = ({ onNavigateHome }) => {
  return (
    <div className={styles.empty}>
      <div className={styles.empty__container}>
        <div className={styles.empty__icon}>🛒</div>
        <h2 className={styles.empty__title}>Carrito vacío</h2>
        <p className={styles.empty__text}>
          No hay productos en tu carrito para proceder al checkout.
        </p>
        <button 
          className={styles.empty__button}
          onClick={onNavigateHome}
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
};

export default CheckoutEmpty;