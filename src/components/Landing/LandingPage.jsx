import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import logoImage from '../../assets/Gemini_Generated_Image_fmgolefmgolefmgo.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirección automática después de 5 segundos
    const redirectTimer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    // Temporizador para el contador
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Limpieza de timers
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  const handleManualRedirect = () => {
    navigate('/home');
  };

  return (
    <div className={styles.landing}>
      <div className={styles.landing__container}>
        <div className={styles.landing__content}>
          <div className={styles.landing__logo}>
            <span className={styles.landing__logoIcon}>📚</span>
            <h1 className={styles.landing__title}>Relatos de Papel</h1>
          </div>

          <img 
            src={logoImage} 
            alt="Relatos de Papel" 
            className={styles.landing__image}
          />
          <div className={styles.landing__message}>
            <p className={styles.landing__text}>
              Descubre miles de libros de todas las categorías
            </p>
            <p className={styles.landing__text}>
              Ofertas exclusivas y envío rápido
            </p>
          </div>

          <div className={styles.landing__countdown}>
            <p className={styles.landing__countdownText}>
              Redirigiendo a la tienda en <span className={styles.landing__countdownNumber}>{countdown}</span> segundos
            </p>
            <div className={styles.landing__countdownBar}>
              <div 
                className={styles.landing__countdownProgress}
                style={{ width: `${(5 - countdown) * 20}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.landing__actions}>
            <button 
              className={`${styles.landing__button} ${styles['landing__button--primary']}`}
              onClick={handleManualRedirect}
            >
              Entrar ahora
            </button>
          </div>

          <div className={styles.landing__features}>
            <div className={styles.landing__feature}>
              <span className={styles.landing__featureIcon}>🚚</span>
              <span className={styles.landing__featureText}>Envío gratis</span>
            </div>
            <div className={styles.landing__feature}>
              <span className={styles.landing__featureIcon}>🛡️</span>
              <span className={styles.landing__featureText}>Pago seguro</span>
            </div>
            <div className={styles.landing__feature}>
              <span className={styles.landing__featureIcon}>⭐</span>
              <span className={styles.landing__featureText}>Reseñas verificadas</span>
            </div>
          </div>
        </div>

        <div className={styles.landing__footer}>
          <p className={styles.landing__footerText}>
            © 2024 Relatos de Papel Grupo 91. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;