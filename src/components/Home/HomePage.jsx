import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { books } from '../../data/books';
import Header from '../Layout/Header/Header';
import BookList from '../Book/BookList/BookList';
import CartSidebar from '../../components/Layout/CartSidebar/CartSidebar';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/Layout/Footer/Footer';
import styles from './HomePage.module.css';

const HomePage = () => {

  // Actualizar contador del carrito
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Usar el contexto del carrito
  const {
    cartItems,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  } = useCart();

  // Filtrar libros por título
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleViewDetail = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAddToCart = (book) => {
    addToCart(book, 1);
    showAddToCartFeedback(book.title);
  };

  const showAddToCartFeedback = (bookTitle) => {
    const feedback = document.createElement('div');
    feedback.textContent = `¡${bookTitle} añadido al carrito!`;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #38a169;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999;
      animation: fadeInOut 3s ease;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className={styles.home}>
      <Header 
        onSearch={handleSearch}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className={styles.home__main}>
        <div className={styles.home__container}>
          <div className={styles.home__header}>
            <h1 className={styles.home__title}>Nuestra Colección</h1>
            <p className={styles.home__subtitle}>
              {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>

          {filteredBooks.length > 0 ? (
            <BookList
              books={filteredBooks}
              onAddToCart={handleAddToCart}
              onViewDetail={handleViewDetail}
            />
          ) : (
            <div className={styles.home__empty}>
              <div className={styles.home__emptyIcon}>🔍</div>
              <h3 className={styles.home__emptyTitle}>No se encontraron libros</h3>
              <p className={styles.home__emptyText}>
                No hay libros que coincidan con "{searchTerm}". 
                Intenta con otros términos de búsqueda.
              </p>
              <button 
                className={styles.home__emptyButton}
                onClick={() => setSearchTerm('')}
              >
                Ver todos los libros
              </button>
            </div>
          )}

          <div className={styles.home__featured}>
            <h2 className={styles.home__featuredTitle}>Libros Destacados</h2>
            <div className={styles.home__featuredGrid}>
              {books.slice(0, 3).map(book => (
                <div key={book.id} className={styles.home__featuredCard}>
                  <div className={styles.home__featuredImage}>
                    <img src={book.image} alt={book.title} />
                  </div>
                  <div className={styles.home__featuredContent}>
                    <h4 className={styles.home__featuredBookTitle}>{book.title}</h4>
                    <p className={styles.home__featuredBookAuthor}>{book.author}</p>
                    <span className={styles.home__featuredPrice}>${book.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
        total={getCartTotal()}
      />

      <Footer/>
    </div>
  );
};

export default HomePage;