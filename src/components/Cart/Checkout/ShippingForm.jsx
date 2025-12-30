import React from 'react';
import styles from './Checkout.module.css';

const ShippingForm = ({ formData, errors, onChange }) => {
  return (
    <div className={styles.checkout__form}>
      <h2 className={styles.checkout__formTitle}>Información de Envío</h2>
      
      <div className={styles.checkout__formRow}>
        <div className={styles.checkout__formGroup}>
          <label className={styles.checkout__label}>
            Nombre *
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              className={`${styles.checkout__input} ${errors.firstName ? styles['checkout__input--error'] : ''}`}
              placeholder="Juan"
            />
            {errors.firstName && (
              <span className={styles.checkout__error}>{errors.firstName}</span>
            )}
          </label>
        </div>
        
        <div className={styles.checkout__formGroup}>
          <label className={styles.checkout__label}>
            Apellido *
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              className={`${styles.checkout__input} ${errors.lastName ? styles['checkout__input--error'] : ''}`}
              placeholder="Pérez"
            />
            {errors.lastName && (
              <span className={styles.checkout__error}>{errors.lastName}</span>
            )}
          </label>
        </div>
      </div>

      <div className={styles.checkout__formGroup}>
        <label className={styles.checkout__label}>
          Email *
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className={`${styles.checkout__input} ${errors.email ? styles['checkout__input--error'] : ''}`}
            placeholder="juan.perez@email.com"
          />
          {errors.email && (
            <span className={styles.checkout__error}>{errors.email}</span>
          )}
        </label>
      </div>

      <div className={styles.checkout__formGroup}>
        <label className={styles.checkout__label}>
          Teléfono *
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={`${styles.checkout__input} ${errors.phone ? styles['checkout__input--error'] : ''}`}
            placeholder="+34 600 123 456"
          />
          {errors.phone && (
            <span className={styles.checkout__error}>{errors.phone}</span>
          )}
        </label>
      </div>

      <div className={styles.checkout__formGroup}>
        <label className={styles.checkout__label}>
          Dirección *
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            className={`${styles.checkout__input} ${errors.address ? styles['checkout__input--error'] : ''}`}
            placeholder="Calle Principal 123"
          />
          {errors.address && (
            <span className={styles.checkout__error}>{errors.address}</span>
          )}
        </label>
      </div>

      <div className={styles.checkout__formRow}>
        <div className={styles.checkout__formGroup}>
          <label className={styles.checkout__label}>
            Ciudad *
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
              className={`${styles.checkout__input} ${errors.city ? styles['checkout__input--error'] : ''}`}
              placeholder="Madrid"
            />
            {errors.city && (
              <span className={styles.checkout__error}>{errors.city}</span>
            )}
          </label>
        </div>
        
        <div className={styles.checkout__formGroup}>
          <label className={styles.checkout__label}>
            Código Postal *
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={onChange}
              className={`${styles.checkout__input} ${errors.zipCode ? styles['checkout__input--error'] : ''}`}
              placeholder="28001"
            />
            {errors.zipCode && (
              <span className={styles.checkout__error}>{errors.zipCode}</span>
            )}
          </label>
        </div>
      </div>

      <div className={styles.checkout__formGroup}>
        <label className={styles.checkout__label}>
          País
          <select
            name="country"
            value={formData.country}
            onChange={onChange}
            className={styles.checkout__select}
          >
            <option value="España">España</option>
            <option value="Argentina">Argentina</option>
            <option value="México">México</option>
            <option value="Estados Unidos">Estados Unidos</option>
            <option value="Colombia">Colombia</option>
            <option value="Portugal">Portugal</option>
            <option value="Francia">Francia</option>
            <option value="Italia">Italia</option>
            <option value="Alemania">Alemania</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default ShippingForm;