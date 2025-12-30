import React from 'react';
import styles from './Checkout.module.css';

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Información' },
    { number: 2, label: 'Pago' },
    { number: 3, label: 'Confirmación' }
  ];

  return (
    <div className={styles.checkout__progress}>
      <div className={styles.checkout__progressSteps}>
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className={`${styles.checkout__progressStep} ${
                currentStep >= step.number
                  ? styles['checkout__progressStep--active']
                  : ''
              }`}
            >
              <div className={styles.checkout__progressStepNumber}>
                {step.number}
              </div>
              <span className={styles.checkout__progressStepText}>
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className={styles.checkout__progressLine}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;