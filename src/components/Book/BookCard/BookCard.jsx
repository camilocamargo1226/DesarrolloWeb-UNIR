import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookCard.module.css';

const BookCard = ({ book, onAddToCart, onViewDetail }) => {
  const navigate = useNavigate();

  const handleViewDetailClick = () => {
    if (onViewDetail) {
      onViewDetail();  // Si viene como prop, usarla
    } else {
      navigate(`/book/${book.id}`);  // Si no, navegar directamente
    }
  };

  const handleCardClick = () => {
    handleViewDetailClick();
  };

  return (
    <div className={styles.bookCard}>
      {/* Book Image */}
      <div 
        className={styles.bookCard__imageContainer}
        onClick={handleCardClick}
      >
        <img 
          src={book.image} 
          alt={book.title}
          className={styles.bookCard__image}
        />
        {book.stock < 5 && (
          <div className={styles.bookCard__stockBadge}>
            ¡Últimas {book.stock} unidades!
          </div>
        )}
      </div>

      {/* Book Content */}
      <div className={styles.bookCard__content}>
        <div 
          className={styles.bookCard__info}
          onClick={handleCardClick}
        >
          <h3 className={styles.bookCard__title}>{book.title}</h3>
          <p className={styles.bookCard__author}>{book.author}</p>
          <p className={styles.bookCard__category}>{book.category}</p>
        </div>

        <div className={styles.bookCard__footer}>
          <div className={styles.bookCard__priceSection}>
            <span className={styles.bookCard__price}>${book.price}</span>
            <span className={styles.bookCard__pages}>{book.pages} páginas</span>
          </div>

          <div className={styles.bookCard__actions}>
            <button 
              className={`${styles.bookCard__button} ${styles['bookCard__button--secondary']}`}
              onClick={handleViewDetailClick}
            >
              Ver detalle
            </button>
            <button 
              className={`${styles.bookCard__button} ${styles['bookCard__button--primary']}`}
              onClick={() => onAddToCart(book)}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;