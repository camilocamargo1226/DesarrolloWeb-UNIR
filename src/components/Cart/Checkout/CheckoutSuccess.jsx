import React from 'react';
import styles from './Checkout.module.css';

const CheckoutSuccess = ({ total, onNavigateHome, purchaseResults, userEmail }) => {
  return (
    <div className={styles.checkout}>
      <div className={styles.checkout__success}>
        <div className={styles.checkout__successIcon}>🎉</div>
        <h2 className={styles.checkout__successTitle}>¡Pedido Completado!</h2>
        <p className={styles.checkout__successText}>
          Tu pedido ha sido procesado exitosamente.
        </p>
        
        <div className={styles.checkout__successDetails}>
          <p>Email de contacto: <strong>{userEmail}</strong></p>
          <p>Total pagado: <strong>${total.toFixed(2)}</strong></p>
          <p>Fecha estimada de entrega: <strong>5-7 días hábiles</strong></p>
          
          {purchaseResults && purchaseResults.length > 0 && (
            <div className={styles.checkout__purchases}>
              <h3>Detalle de compras:</h3>
              <ul className={styles.checkout__purchasesList}>
                {purchaseResults.map((purchase, index) => (
                  <li key={index} className={styles.checkout__purchaseItem}>
                    <span className={styles.checkout__purchaseBook}>
                      {purchase.book?.title || `Libro ID: ${purchase.bookId}`}
                    </span>
                    <span className={styles.checkout__purchaseStatus}>
                      Estado: {purchase.status}
                    </span>
                    <span className={styles.checkout__purchaseDate}>
                      {new Date(purchase.purchaseDate).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p className={styles.checkout__orderNumber}>
            Número de orden: <strong>ORD-{Date.now().toString().slice(-8)}</strong>
          </p>
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