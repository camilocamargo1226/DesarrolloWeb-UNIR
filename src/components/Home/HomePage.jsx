import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/api'; // Importamos el servicio
import Header from '../Layout/Header/Header';
import BookList from '../Book/BookList/BookList';
import CartSidebar from '../../components/Layout/CartSidebar/CartSidebar';
import { useCart } from '../../context/CartContext';
import Footer from '../../components/Layout/Footer/Footer';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]); // Estado para los libros de la API
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

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

  // Cargar libros desde la API al montar el componente
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getAllBooks();
        setBooks(data);
        setFilteredBooks(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los libros. Por favor, intenta de nuevo.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
  }, [searchTerm, books]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleViewDetail = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAddToCart = (book) => {
  // Asegurarnos de que el libro tenga el campo imageUrl correcto
  const bookForCart = {
    ...book,
    // Si el libro tiene imageUrl del backend, lo usamos, si no, intentamos con image
    image: book.imageUrl || book.image || 'https://placehold.co/200x300/2c3e50/white?text=Libro',
    quantity: 1
  };
  
  addToCart(bookForCart, 1);
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

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className={styles.home}>
        <Header 
          onSearch={handleSearch}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        <main className={styles.home__main}>
          <div className={styles.home__container}>
            <div className={styles.loading}>
              <div className={styles.loading__spinner}></div>
              <p>Cargando libros...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className={styles.home}>
        <Header 
          onSearch={handleSearch}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        <main className={styles.home__main}>
          <div className={styles.home__container}>
            <div className={styles.error}>
              <div className={styles.error__icon}>⚠️</div>
              <h3>Error</h3>
              <p>{error}</p>
              <button 
                className={styles.error__button}
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                    <img 
                      src={book.imageUrl} 
                      alt={book.title}
                      className={styles.bookCard__image}
                      referrerPolicy="no-referrer"  // Añade esta línea
                      onError={(e) => {
                        // Si la imagen falla, usar placeholder
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200x300/2c3e50/white?text=Libro';
                      }}
                    />
                  </div>
                  <div className={styles.home__featuredContent}>
                    <h4 className={styles.home__featuredBookTitle}>{book.title}</h4>
                    <p className={styles.home__featuredBookAuthor}>{book.author}</p>
                    <span className={styles.home__featuredPrice}>
                      ${book.price || 'Precio no disponible'}
                    </span>
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