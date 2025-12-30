import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { books } from '../../../data/books';
import Header from '../../../../src/components/Layout/Header/Header';
import Loader from '../../../../src/components/Common/Loader/Loader';
import CartSidebar from '../../../../src/components/Layout/CartSidebar/CartSidebar';
import styles from './BookDetail.module.css';
import { useCart } from '../../../context/CartContext';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const {
    cartItems,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal
  } = useCart();

  // Cargar libro y recomendaciones
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const foundBook = books.find(b => b.id === parseInt(id));
      if (foundBook) {
        setBook(foundBook);
        // Obtener libros recomendados (misma categoría excluyendo el actual)
        const recommended = books
          .filter(b => b.category === foundBook.category && b.id !== foundBook.id)
          .slice(0, 3);
        setRecommendedBooks(recommended);
      }
      setLoading(false);
    }, 300);
  }, [id]);

  

  const handleAddToCart = () => {
    if (!book) return;
    addToCart(book, quantity);
    showAddToCartNotification();
    setQuantity(1);
  };

  const showAddToCartNotification = () => {
    // Aquí podríamos usar un toast component
    alert(`¡${quantity} copia${quantity > 1 ? 's' : ''} de "${book.title}" añadida${quantity > 1 ? 's' : ''} al carrito!`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleRemoveFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== bookId));
  };

  const handleUpdateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(bookId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className={styles.bookDetail}>
        <Header 
          onSearch={() => {}}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        <Loader message='Cargando Informacion del libro...'/>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.bookDetail}>
        <Header 
          onSearch={() => {}}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        <div className={styles.bookDetail__notFound}>
          <h2>Libro no encontrado</h2>
          <p>El libro que buscas no está disponible.</p>
          <button 
            className={styles.bookDetail__backButton}
            onClick={() => navigate('/home')}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookDetail}>
      <Header 
        onSearch={() => {}}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className={styles.bookDetail__main}>
        <div className={styles.bookDetail__container}>
          {/* Main content */}
          <div className={styles.bookDetail__content}>
            {/* Book image */}
            <div className={styles.bookDetail__imageSection}>
              <div className={styles.bookDetail__imageContainer}>
                <img 
                  src={book.image} 
                  alt={book.title}
                  className={styles.bookDetail__image}
                />
              </div>
            </div>

            {/* Book info */}
            <div className={styles.bookDetail__infoSection}>
              <div className={styles.bookDetail__header}>
                <h1 className={styles.bookDetail__title}>{book.title}</h1>
                <p className={styles.bookDetail__author}>por {book.author}</p>
                
                <div className={styles.bookDetail__rating}>
                  <div className={styles.bookDetail__stars}>
                    {'★★★★★'.split('').map((star, index) => (
                      <span key={index} className={styles.bookDetail__star}>
                        {star}
                      </span>
                    ))}
                  </div>
                  <span className={styles.bookDetail__ratingCount}>(128 reseñas)</span>
                </div>
              </div>

              <div className={styles.bookDetail__priceSection}>
                <span className={styles.bookDetail__price}>${book.price}</span>
                <span className={styles.bookDetail__oldPrice}>${(book.price * 1.2).toFixed(2)}</span>
                <span className={styles.bookDetail__discount}>-20%</span>
              </div>

              <div className={styles.bookDetail__features}>
                <div className={styles.bookDetail__feature}>
                  <span className={styles.bookDetail__featureIcon}>📦</span>
                  <span className={styles.bookDetail__featureText}>Envío gratis</span>
                </div>
                <div className={styles.bookDetail__feature}>
                  <span className={styles.bookDetail__featureIcon}>↩️</span>
                  <span className={styles.bookDetail__featureText}>Devolución 30 días</span>
                </div>
                <div className={styles.bookDetail__feature}>
                  <span className={styles.bookDetail__featureIcon}>🛡️</span>
                  <span className={styles.bookDetail__featureText}>Pago seguro</span>
                </div>
              </div>

              <div className={styles.bookDetail__quantity}>
                <span className={styles.bookDetail__quantityLabel}>Cantidad:</span>
                <div className={styles.bookDetail__quantityControls}>
                  <button 
                    className={styles.bookDetail__quantityButton}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className={styles.bookDetail__quantityValue}>{quantity}</span>
                  <button 
                    className={styles.bookDetail__quantityButton}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
                <span className={styles.bookDetail__stock}>Disponible: {book.stock || 15} unidades</span>
              </div>

              <div className={styles.bookDetail__actions}>
                <button
                  className={`${styles.bookDetail__actionButton} ${styles['bookDetail__actionButton--primary']}`}
                  onClick={handleAddToCart}
                >
                  <span className={styles.bookDetail__actionIcon}>🛒</span>
                  Añadir al carrito
                </button>
                <button 
                  className={`${styles.bookDetail__actionButton} ${styles['bookDetail__actionButton--secondary']}`}
                  onClick={handleBuyNow}
                >
                  <span className={styles.bookDetail__actionIcon}>⚡</span>
                  Comprar ahora
                </button>
              </div>

              {/* Tabs */}
              <div className={styles.bookDetail__tabs}>
                <button 
                  className={`${styles.bookDetail__tab} ${selectedTab === 'description' ? styles['bookDetail__tab--active'] : ''}`}
                  onClick={() => setSelectedTab('description')}
                >
                  Descripción
                </button>
                <button 
                  className={`${styles.bookDetail__tab} ${selectedTab === 'details' ? styles['bookDetail__tab--active'] : ''}`}
                  onClick={() => setSelectedTab('details')}
                >
                  Detalles
                </button>
                <button 
                  className={`${styles.bookDetail__tab} ${selectedTab === 'reviews' ? styles['bookDetail__tab--active'] : ''}`}
                  onClick={() => setSelectedTab('reviews')}
                >
                  Reseñas
                </button>
              </div>

              <div className={styles.bookDetail__tabContent}>
                {selectedTab === 'description' && (
                  <div className={styles.bookDetail__description}>
                    <p>{book.description}</p>
                    <p>Una obra maestra que ha cautivado a lectores de todas las generaciones con su narrativa envolvente y personajes inolvidables.</p>
                  </div>
                )}
                
                {selectedTab === 'details' && (
                  <div className={styles.bookDetail__details}>
                    <ul className={styles.bookDetail__detailsList}>
                      <li><strong>ISBN:</strong> {book.isbn || '978-8491050896'}</li>
                      <li><strong>Páginas:</strong> {book.pages || 350}</li>
                      <li><strong>Editorial:</strong> Editorial Relatos</li>
                      <li><strong>Año de publicación:</strong> 2023</li>
                      <li><strong>Idioma:</strong> Español</li>
                      <li><strong>Formato:</strong> Tapa blanda</li>
                    </ul>
                  </div>
                )}
                
                {selectedTab === 'reviews' && (
                  <div className={styles.bookDetail__reviews}>
                    <div className={styles.bookDetail__review}>
                      <div className={styles.bookDetail__reviewHeader}>
                        <span className={styles.bookDetail__reviewAuthor}>María G.</span>
                        <div className={styles.bookDetail__reviewRating}>★★★★★</div>
                      </div>
                      <p className={styles.bookDetail__reviewText}>
                        "Una lectura obligatoria. No podía dejar de leerlo."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems} // Usar del contexto
        onRemoveItem={removeFromCart} // Usar del contexto
        onUpdateQuantity={updateQuantity} // Usar del contexto
        onCheckout={() => navigate('/checkout')}
        total={getCartTotal()} // Usar del contexto
      />
    </div>
  );
};

export default BookDetail;