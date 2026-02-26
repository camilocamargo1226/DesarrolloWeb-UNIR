import React, { useState } from 'react';
import styles from './Checkout.module.css';

const OrderSummary = ({ 
  cartItems, 
  subtotal, 
  shipping, 
  discount, 
  total, 
  onContinueShopping 
}) => {
  
  // Función para obtener la URL de la imagen correcta
  const getImageUrl = (item) => {
    return item.imageUrl || item.image || 'https://placehold.co/200x300/2c3e50/white?text=Libro';
  };

  // Manejador de error de imagen
  const handleImageError = (e, item) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/200x300/2c3e50/white?text=${encodeURIComponent(item.title.substring(0, 20))}`;
  };

  return (
    <div className={styles.checkout__summarySection}>
      <div className={styles.checkout__summary}>
        <h3 className={styles.checkout__summaryTitle}>Resumen del Pedido</h3>
        
        <div className={styles.checkout__orderItems}>
          {cartItems.map(item => (
            <div key={item.id} className={styles.checkout__orderItem}>
              <div className={styles.checkout__orderItemImage}>
                <img 
                  src={getImageUrl(item)}
                  alt={item.title}
                  onError={(e) => handleImageError(e, item)}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className={styles.checkout__orderItemInfo}>
                <h4 className={styles.checkout__orderItemTitle}>{item.title}</h4>
                <p className={styles.checkout__orderItemAuthor}>{item.author}</p>
                <div className={styles.checkout__orderItemDetails}>
                  <span className={styles.checkout__orderItemQuantity}>
                    Cantidad: {item.quantity}
                  </span>
                  <span className={styles.checkout__orderItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.checkout__summaryDetails}>
          <div className={styles.checkout__summaryRow}>
            <span className={styles.checkout__summaryLabel}>Subtotal</span>
            <span className={styles.checkout__summaryValue}>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className={styles.checkout__summaryRow}>
            <span className={styles.checkout__summaryLabel}>Envío</span>
            <span className={styles.checkout__summaryValue}>
              {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          
          <div className={styles.checkout__summaryRow}>
            <span className={styles.checkout__summaryLabel}>Descuento (10%)</span>
            <span className={styles.checkout__summaryValue}>-${discount.toFixed(2)}</span>
          </div>
          
          <div className={styles.checkout__summaryDivider}></div>
          
          <div className={`${styles.checkout__summaryRow} ${styles['checkout__summaryRow--total']}`}>
            <span className={styles.checkout__summaryLabel}>Total</span>
            <span className={styles.checkout__summaryValue}>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.checkout__summaryFooter}>
          <button
            className={`${styles.checkout__button} ${styles['checkout__button--secondary']} ${styles['checkout__button--full']}`}
            onClick={onContinueShopping}
          >
            ← Seguir comprando
          </button>
          
          <div className={styles.checkout__guarantee}>
            <div className={styles.checkout__guaranteeItem}>
              <span className={styles.checkout__guaranteeIcon}>✓</span>
              <span className={styles.checkout__guaranteeText}>Garantía de devolución 30 días</span>
            </div>
            <div className={styles.checkout__guaranteeItem}>
              <span className={styles.checkout__guaranteeIcon}>✓</span>
              <span className={styles.checkout__guaranteeText}>Soporte 24/7</span>
            </div>
            <div className={styles.checkout__guaranteeItem}>
              <span className={styles.checkout__guaranteeIcon}>✓</span>
              <span className={styles.checkout__guaranteeText}>Entrega garantizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;