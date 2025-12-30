import React from 'react';
import BookCard from '../BookCard/BookCard';
import styles from './BookList.module.css';

const BookList = ({ books, onAddToCart, onViewDetail }) => {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className={styles.bookList}>
      <div className={styles.bookList__grid}>
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onAddToCart={() => onAddToCart(book)}
            onViewDetail={() => onViewDetail(book.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;