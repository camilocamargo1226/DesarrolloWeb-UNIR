import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { BookOpen } from "lucide-react";
import Book3D from "../Book3D";
import bookCover1 from "../../assets/book-cover-1.png";
import bookCover2 from "../../assets/book-cover-2.png";
import bookCover3 from "../../assets/book-cover-3.png";

const featuredBooks = [
  { cover: bookCover1, title: "Cien Años de Soledad", author: "Gabriel García Márquez", spine: "hsl(25, 45%, 22%)" },
  { cover: bookCover2, title: "El Principito", author: "Antoine de Saint-Exupéry", spine: "hsl(220, 55%, 35%)" },
  { cover: bookCover3, title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", spine: "hsl(15, 40%, 28%)" },
];

const LandingPage = () => {
  const [hasInteracted] = useState(false);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

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
          
          {/* Header / Brand - AHORA USA CLASES BEM */}
          <div className={styles.landing__header}>
            <div className={styles.landing__brand}>
              <BookOpen className={styles.landing__brandIcon} strokeWidth={1.5} />
              <span className={styles.landing__brandText}>
                Relatos de Papel
              </span>
            </div>

            <h1 className={styles.landing__title}>
              Donde cada página{" "}
              <span className={styles['landing__title--highlight']}>
                cuenta una historia
              </span>
            </h1>

            <p className={styles.landing__subtitle}>
              Descubre una colección cuidada de libros que inspiran, educan y
              transforman. Tu próxima gran lectura te espera.
            </p>
          </div>

          {/* 3D Books showcase - AHORA USA CLASES BEM */}
          <div className={styles.landing__showcase}>
            <p className={styles.landing__showcaseLabel}>
              Destacados — pasa el cursor sobre los libros
            </p>
            <div className={styles.landing__booksGrid}>
              {featuredBooks.map((book, i) => (
                <Book3D
                  key={book.title}
                  coverImage={book.cover}
                  title={book.title}
                  author={book.author}
                  spineColor={book.spine}
                  delay={0.7 + i * 0.2}
                />
              ))}
            </div>
          </div>

          {/* Bounce loader dots - AHORA USA CLASES BEM */}
          {!hasInteracted && (
            <div className={styles.landing__loader}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={styles.landing__loaderDot}
                />
              ))}
            </div>
          )}

          {/* Estas secciones ya usaban BEM y se mantienen igual */}
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