import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext.jsx';
import { paymentService } from '../../../services/api'; // Importamos el servicio de pagos
import Footer from '../../Layout/Footer/Footer';
import CheckoutSuccess from './CheckoutSuccess';
import CheckoutEmpty from './CheckoutEmpty';
import ProgressSteps from './ProgressSteps';
import OrderSummary from './OrderSummary';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [purchaseResults, setPurchaseResults] = useState([]); // Para guardar resultados de compras
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'España',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: ''
  });
  const [errors, setErrors] = useState({});
  const { cartItems, clearCart, getCartTotal } = useCart();

  // Calcular totales
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = subtotal * 0.1;
  const total = subtotal + shipping - discount;

  // Limpiar carrito después de completar la orden
  useEffect(() => {
    if (orderCompleted) {
      const timer = setTimeout(() => {
        clearCart();
        navigate('/home');
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [orderCompleted, clearCart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido';
      if (!formData.email.trim()) {
        newErrors.email = 'Email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Teléfono es requerido';
      if (!formData.address.trim()) newErrors.address = 'Dirección es requerida';
      if (!formData.city.trim()) newErrors.city = 'Ciudad es requerida';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'Código postal es requerido';
    }
    
    if (step === 2) {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Número de tarjeta es requerido';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Número de tarjeta inválido (16 dígitos)';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Nombre en la tarjeta es requerido';
      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Fecha de expiración es requerida';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Formato inválido (MM/AA)';
      }
      if (!formData.cardCVC.trim()) {
        newErrors.cardCVC = 'CVC es requerido';
      } else if (!/^\d{3}$/.test(formData.cardCVC)) {
        newErrors.cardCVC = 'CVC inválido (3 dígitos)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  // Función para procesar todas las compras
  const processPurchases = async () => {
    const results = [];
    const errors = [];

    // Procesar cada item del carrito
    for (const item of cartItems) {
      try {
        // Para cada unidad del libro, crear una compra
        for (let i = 0; i < item.quantity; i++) {
          const result = await paymentService.createPurchase(item.id, formData.email);
          results.push(result);
          // Pequeña pausa para no saturar la API
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error comprando libro ${item.id}:`, error);
        errors.push({
          bookId: item.id,
          title: item.title,
          error: error.message
        });
      }
    }

    return { results, errors };
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return;
    
    setIsProcessing(true);
    
    try {
      // Procesar todas las compras
      const { results, errors } = await processPurchases();
      
      setPurchaseResults(results);
      
      if (errors.length > 0) {
        // Si hubo errores parciales, mostrar mensaje
        alert(`Algunos libros no pudieron ser procesados. ${errors.length} error(es).`);
        console.error('Errores en compras:', errors);
      } else {
        // Todas las compras fueron exitosas
        alert('¡Pedido realizado con éxito! Tu pedido ha sido procesado correctamente.');
      }
      
      setOrderCompleted(true);
      
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/home');
  };

  if (cartItems.length === 0 && !orderCompleted) {
    return (
      <div className={styles.checkout}>
        <div className={styles.checkout__empty}>
          <div className={styles.checkout__emptyIcon}>🛒</div>
          <h2 className={styles.checkout__emptyTitle}>Carrito vacío</h2>
          <p className={styles.checkout__emptyText}>
            No hay productos en tu carrito para proceder al checkout.
          </p>
          <button 
            className={styles.checkout__emptyButton}
            onClick={() => navigate('/home')}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderCompleted) {
    return <CheckoutEmpty onNavigateHome={handleContinueShopping} />;
  }

  if (orderCompleted) {
    return (
      <CheckoutSuccess 
        total={total} 
        onNavigateHome={handleContinueShopping}
        purchaseResults={purchaseResults}
        userEmail={formData.email}
      />
    );
  }

  return (
    <div className={styles.checkout}>
      <header className={styles.checkout__header}>
        <div className={styles.checkout__container}>
          <h1 className={styles.checkout__title}>Finalizar Compra</h1>
          <p className={styles.checkout__subtitle}>
            Completa los siguientes pasos para completar tu pedido
          </p>
        </div>
      </header>

      <main className={styles.checkout__main}>
        <div className={styles.checkout__container}>
          {/* Progress Steps */}
          <ProgressSteps currentStep={step} />

          <div className={styles.checkout__content}>
            {/* Left Column: Form */}
            <div className={styles.checkout__formSection}>
              {step === 1 && (
                <ShippingForm 
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                />
              )}

              {step === 2 && (
                <PaymentForm 
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                />
              )}

              {/* Navigation Buttons */}
              <div className={styles.checkout__navigation}>
                {step > 1 && (
                  <button
                    className={`${styles.checkout__button} ${styles['checkout__button--secondary']}`}
                    onClick={handlePrevStep}
                    disabled={isProcessing}
                  >
                    ← Anterior
                  </button>
                )}

                {step < 2 ? (
                  <button
                    className={`${styles.checkout__button} ${styles['checkout__button--primary']}`}
                    onClick={handleNextStep}
                    disabled={isProcessing}
                  >
                    Continuar a Pago →
                  </button>
                ) : (
                  <button
                    className={`${styles.checkout__button} ${styles['checkout__button--primary']}`}
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className={styles.checkout__spinner}></span>
                        Procesando...
                      </>
                    ) : (
                      'Confirmar y Pagar'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
};

export default Checkout;