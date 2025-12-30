import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CartSidebar.module.css';

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemoveItem, 
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  total 
}) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [localItems, setLocalItems] = useState(items);

  // Sincronizar items locales con props
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Efecto para animación de entrada/salida
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleQuantityChange = (id, change) => {
    const item = localItems.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        onUpdateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemove = (id) => {
    onRemoveItem(id);
  };

  const handleCheckoutClick = () => {
    onClose();
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/home');
  };

  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.cartSidebar__overlay} ${isOpen ? styles['cartSidebar__overlay--visible'] : ''}`}
        onClick={handleOverlayClick}
      />
      
      {/* Sidebar */}
      <div className={`${styles.cartSidebar} ${isOpen ? styles['cartSidebar--open'] : ''}`}>
        {/* Header */}
        <div className={styles.cartSidebar__header}>
          <div className={styles.cartSidebar__headerContent}>
            <h2 className={styles.cartSidebar__title}>
              <span className={styles.cartSidebar__titleIcon}>🛒</span>
              Tu Carrito
            </h2>
            <button 
              className={styles.cartSidebar__closeButton}
              onClick={onClose}
              aria-label="Cerrar carrito"
            >
              ×
            </button>
          </div>
          <p className={styles.cartSidebar__subtitle}>
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        {/* Content */}
        <div className={styles.cartSidebar__content}>
          {items.length === 0 ? (
            <div className={styles.cartSidebar__empty}>
              <div className={styles.cartSidebar__emptyIcon}>😔</div>
              <h3 className={styles.cartSidebar__emptyTitle}>Tu carrito está vacío</h3>
              <p className={styles.cartSidebar__emptyText}>
                Añade algunos libros para comenzar tu compra
              </p>
              <button 
                className={styles.cartSidebar__emptyButton}
                onClick={handleContinueShopping}
              >
                Explorar libros
              </button>
            </div>
          ) : (
            <>
              {/* Items list */}
              <div className={styles.cartSidebar__items}>
                {items.map(item => (
                  <div key={item.id} className={styles.cartSidebar__item}>
                    {/* Item image */}
                    <div className={styles.cartSidebar__itemImage}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className={styles.cartSidebar__itemImg}
                      />
                    </div>

                    {/* Item info */}
                    <div className={styles.cartSidebar__itemInfo}>
                      <div className={styles.cartSidebar__itemHeader}>
                        <h4 className={styles.cartSidebar__itemTitle}>{item.title}</h4>
                        <button 
                          className={styles.cartSidebar__itemRemove}
                          onClick={() => handleRemove(item.id)}
                          aria-label="Eliminar producto"
                        >
                          ×
                        </button>
                      </div>
                      
                      <p className={styles.cartSidebar__itemAuthor}>{item.author}</p>
                      
                      <div className={styles.cartSidebar__itemDetails}>
                        <div className={styles.cartSidebar__quantityControls}>
                          <button 
                            className={styles.cartSidebar__quantityButton}
                            onClick={() => handleQuantityChange(item.id, -1)}
                            aria-label="Reducir cantidad"
                          >
                            −
                          </button>
                          <span className={styles.cartSidebar__quantityValue}>
                            {item.quantity}
                          </span>
                          <button 
                            className={styles.cartSidebar__quantityButton}
                            onClick={() => handleQuantityChange(item.id, 1)}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className={styles.cartSidebar__itemPrice}>
                          <span className={styles.cartSidebar__itemUnitPrice}>
                            ${item.price} c/u
                          </span>
                          <span className={styles.cartSidebar__itemTotalPrice}>
                            ${calculateItemTotal(item.price, item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart button */}
              <div className={styles.cartSidebar__clearSection}>
                <button 
                  className={styles.cartSidebar__clearButton}
                  onClick={onClearCart}
                >
                  <span className={styles.cartSidebar__clearIcon}>🗑️</span>
                  Vaciar carrito
                </button>
              </div>

              {/* Order summary */}
              <div className={styles.cartSidebar__summary}>
                <h3 className={styles.cartSidebar__summaryTitle}>Resumen del pedido</h3>
                
                <div className={styles.cartSidebar__summaryRow}>
                  <span className={styles.cartSidebar__summaryLabel}>Subtotal</span>
                  <span className={styles.cartSidebar__summaryValue}>
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <div className={styles.cartSidebar__summaryRow}>
                  <span className={styles.cartSidebar__summaryLabel}>Envío</span>
                  <span className={styles.cartSidebar__summaryValue}>
                    {total > 50 ? 'Gratis' : '$5.99'}
                  </span>
                </div>
                
                <div className={styles.cartSidebar__summaryRow}>
                  <span className={styles.cartSidebar__summaryLabel}>Descuento</span>
                  <span className={styles.cartSidebar__summaryValue}>
                    -${(total * 0.1).toFixed(2)}
                  </span>
                </div>
                
                <div className={styles.cartSidebar__summaryDivider} />
                
                <div className={`${styles.cartSidebar__summaryRow} ${styles['cartSidebar__summaryRow--total']}`}>
                  <span className={styles.cartSidebar__summaryLabel}>Total</span>
                  <span className={styles.cartSidebar__summaryValue}>
                    ${(total * 0.9).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.cartSidebar__actions}>
                <button 
                  className={`${styles.cartSidebar__actionButton} ${styles['cartSidebar__actionButton--primary']}`}
                  onClick={handleCheckoutClick}
                >
                  Proceder al pago
                  <span className={styles.cartSidebar__actionIcon}>→</span>
                </button>
                
                <button 
                  className={`${styles.cartSidebar__actionButton} ${styles['cartSidebar__actionButton--secondary']}`}
                  onClick={handleContinueShopping}
                >
                  Seguir comprando
                </button>
              </div>

              {/* Security info */}
              <div className={styles.cartSidebar__security}>
                <div className={styles.cartSidebar__securityItem}>
                  <span className={styles.cartSidebar__securityIcon}>🛡️</span>
                  <span className={styles.cartSidebar__securityText}>Pago 100% seguro</span>
                </div>
                <div className={styles.cartSidebar__securityItem}>
                  <span className={styles.cartSidebar__securityIcon}>🔒</span>
                  <span className={styles.cartSidebar__securityText}>Datos protegidos</span>
                </div>
                <div className={styles.cartSidebar__securityItem}>
                  <span className={styles.cartSidebar__securityIcon}>↩️</span>
                  <span className={styles.cartSidebar__securityText}>Devolución fácil</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;