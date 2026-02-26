import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../../../services/api'; // Importamos el servicio API
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
  const [error, setError] = useState(null);
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

  // Función para obtener la URL de la imagen
  const getImageUrl = (book) => {
    return book.imageUrl || book.image || 'https://placehold.co/400x600/2c3e50/white?text=Libro';
  };

  // Cargar libro desde la API
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Llamar a la API para obtener el libro por ID
        const bookData = await bookService.getBookById(id);
        
        if (bookData) {
          setBook(bookData);
          
          // Obtener libros recomendados (misma categoría excluyendo el actual)
          // Necesitamos hacer otra llamada a la API para esto
          const allBooks = await bookService.getAllBooks();
          const recommended = allBooks
            .filter(b => b.category === bookData.category && b.id !== bookData.id)
            .slice(0, 3);
          setRecommendedBooks(recommended);
        } else {
          setError('Libro no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar el libro:', err);
        setError('Error al cargar la información del libro. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    
    // Normalizar el libro para el carrito
    const bookForCart = {
      ...book,
      image: getImageUrl(book) // Asegurar que tenga el campo image
    };
    
    addToCart(bookForCart, quantity);
    showAddToCartNotification();
    setQuantity(1);
  };

  const showAddToCartNotification = () => {
    // Crear un toast personalizado en lugar de alert
    const notification = document.createElement('div');
    notification.textContent = `¡${quantity} copia${quantity > 1 ? 's' : ''} de "${book.title}" añadida${quantity > 1 ? 's' : ''} al carrito!`;
    notification.style.cssText = `
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
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (book?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/400x600/2c3e50/white?text=${encodeURIComponent(book?.title?.substring(0, 20) || 'Libro')}`;
  };

  if (loading) {
    return (
      <div className={styles.bookDetail}>
        <Header 
          onSearch={() => {}}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        <Loader message='Cargando información del libro...'/>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className={styles.bookDetail}>
        <Header 
          onSearch={() => {}}
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        <div className={styles.bookDetail__notFound}>
          <h2>Libro no encontrado</h2>
          <p>{error || 'El libro que buscas no está disponible.'}</p>
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
                  src={getImageUrl(book)}
                  alt={book.title}
                  className={styles.bookDetail__image}
                  onError={handleImageError}
                  referrerPolicy="no-referrer"
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
                    {[...Array(5)].map((_, index) => (
                      <span 
                        key={index} 
                        className={`${styles.bookDetail__star} ${index < book.rating ? styles['bookDetail__star--filled'] : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.bookDetail__ratingCount}>({book.rating || 0}/5)</span>
                </div>
              </div>

              <div className={styles.bookDetail__priceSection}>
                <span className={styles.bookDetail__price}>${book.price?.toFixed(2)}</span>
                {book.price && (
                  <>
                    <span className={styles.bookDetail__oldPrice}>${(book.price * 1.2).toFixed(2)}</span>
                    <span className={styles.bookDetail__discount}>-20%</span>
                  </>
                )}
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
                    disabled={quantity >= (book.stock || 10)}
                  >
                    +
                  </button>
                </div>
                <span className={styles.bookDetail__stock}>
                  Disponible: {book.stock || 'No especificado'} {book.stock ? 'unidades' : ''}
                </span>
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
                    <p>{book.description || 'No hay descripción disponible para este libro.'}</p>
                  </div>
                )}
                
                {selectedTab === 'details' && (
                  <div className={styles.bookDetail__details}>
                    <ul className={styles.bookDetail__detailsList}>
                      <li><strong>ISBN:</strong> {book.isbn || 'No especificado'}</li>
                      <li><strong>Páginas:</strong> {book.pages || 'No especificado'}</li>
                      <li><strong>Categoría:</strong> {book.category || 'No especificado'}</li>
                      <li><strong>Fecha de publicación:</strong> {book.publicationDate ? new Date(book.publicationDate).toLocaleDateString() : 'No especificado'}</li>
                      <li><strong>Editorial:</strong> Editorial Relatos</li>
                      <li><strong>Idioma:</strong> Español</li>
                      <li><strong>Formato:</strong> Tapa blanda</li>
                    </ul>
                  </div>
                )}
                
                {selectedTab === 'reviews' && (
                  <div className={styles.bookDetail__reviews}>
                    <div className={styles.bookDetail__review}>
                      <div className={styles.bookDetail__reviewHeader}>
                        <span className={styles.bookDetail__reviewAuthor}>Sistema de reseñas</span>
                        <div className={styles.bookDetail__reviewRating}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < (book.rating || 0) ? styles['bookDetail__star--filled'] : ''}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className={styles.bookDetail__reviewText}>
                        Este libro tiene una calificación promedio de {book.rating || 0} estrellas.
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
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
        total={getCartTotal()}
      />
    </div>
  );
};

export default BookDetail;