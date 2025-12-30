import React from 'react';
import styles from './Checkout.module.css';

const PaymentForm = ({ formData, errors, onChange }) => {
  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    if (rawValue.length <= 16) {
      onChange({
        target: {
          name: 'cardNumber',
          value: rawValue
        }
      });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      onChange({
        target: {
          name: 'cardExpiry',
          value: value
        }
      });
    }
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    onChange({
      target: {
        name: 'cardCVC',
        value: value
      }
    });
  };

  return (
    <div className={styles.checkout__form}>
      <h2 className={styles.checkout__formTitle}>Información de Pago</h2>
      
      <div className={styles.checkout__formGroup}>
        <label className={styles.checkout__label}>
          Número de Tarjeta *
          <input
            type="text"
            name="cardNumber"
            value={formatCardNumber(formData.cardNumber)}
            onChange={handleCardNumberChange}
            className={`${styles.checkout__input} ${errors.cardNumber ? styles['checkout__input--error'] : ''}`}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
          />
          {errors.cardNumber && (
            <span className={styles.checkout__error}>{errors.cardNumber}</span>
          )}
        </label>
      </div>

      <div className={styles.checkout__formGroup}>
        <label className={styles.checkout__label}>
          Nombre en la Tarjeta *
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={onChange}
            className={`${styles.checkout__input} ${errors.cardName ? styles['checkout__input--error'] : ''}`}
            placeholder="JUAN PEREZ"
          />
          {errors.cardName && (
            <span className={styles.checkout__error}>{errors.cardName}</span>
          )}
        </label>
      </div>

      <div className={styles.checkout__formRow}>
        <div className={styles.checkout__formGroup}>
          <label className={styles.checkout__label}>
            Fecha de Expiración *
            <input
              type="text"
              name="cardExpiry"
              value={formData.cardExpiry}
              onChange={handleExpiryChange}
              className={`${styles.checkout__input} ${errors.cardExpiry ? styles['checkout__input--error'] : ''}`}
              placeholder="MM/AA"
              maxLength="5"
            />
            {errors.cardExpiry && (
              <span className={styles.checkout__error}>{errors.cardExpiry}</span>
            )}
          </label>
        </div>
        
        <div className={styles.checkout__formGroup}>
          <label className={styles.checkout__label}>
            CVC *
            <input
              type="text"
              name="cardCVC"
              value={formData.cardCVC}
              onChange={handleCVCChange}
              className={`${styles.checkout__input} ${errors.cardCVC ? styles['checkout__input--error'] : ''}`}
              placeholder="123"
              maxLength="3"
            />
            {errors.cardCVC && (
              <span className={styles.checkout__error}>{errors.cardCVC}</span>
            )}
          </label>
        </div>
      </div>

      <div className={styles.checkout__securityInfo}>
        <div className={styles.checkout__securityItem}>
          <span className={styles.checkout__securityIcon}>🔒</span>
          <span className={styles.checkout__securityText}>
            Tu información de pago está protegida con encriptación SSL
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;