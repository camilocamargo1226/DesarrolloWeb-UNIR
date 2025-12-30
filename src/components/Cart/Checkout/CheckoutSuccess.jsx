import React from 'react';
import styles from './Checkout.module.css';

const CheckoutSuccess = ({ total, onNavigateHome }) => {
  return (
      <div className={styles.checkout}>
        <div className={styles.checkout__success}>
          <div className={styles.checkout__successIcon}>🎉</div>
          <h2 className={styles.checkout__successTitle}>¡Pedido Completado!</h2>
          <p className={styles.checkout__successText}>
            Tu pedido ha sido procesado exitosamente.
          </p>
          <div className={styles.checkout__successDetails}>
            <p>Número de orden: <strong>ORD-{Date.now().toString().slice(-8)}</strong></p>
            <p>Total pagado: <strong>${total.toFixed(2)}</strong></p>
            <p>Fecha estimada de entrega: <strong>5-7 días hábiles</strong></p>
          </div>
          <p className={styles.checkout__successRedirect}>
            Redirigiendo a la página principal en 10 segundos...
          </p>
          <button 
            className={styles.checkout__successButton}
            onClick={onNavigateHome}
          >
            Volver ahora
          </button>
        </div>
      </div>
    );
};

export default CheckoutSuccess;