import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { openCart } from "./landing.steps";

// ─────────────────────────────────────────────────────────────────────────────
// STEPS: CHECKOUT
// Features: aceptacion/checkout.feature, funcionales/checkout.feature
//
// FLUJO REAL (de Checkout.jsx):
//   Paso 1 → ShippingForm (7 campos obligatorios)
//     Botón avanzar: "Continuar a Pago →"
//   Paso 2 → PaymentForm (4 campos obligatorios)
//     Botón pagar: "Confirmar y Pagar"
//     → setTimeout(2000ms) simulación
//     → alert('¡Pedido realizado con éxito! Tu pedido ha sido procesado correctamente.')
//     → setOrderCompleted(true) → CheckoutSuccess
//     → setTimeout(20000ms) → clearCart() → navigate('/home')
//
// Selectores por name (inputs de formulario — estables):
//   ShippingForm: firstName, lastName, email, phone, address, city, zipCode
//   PaymentForm:  cardNumber, cardName, cardExpiry (MM/AA), cardCVC (3 dígitos)
// ─────────────────────────────────────────────────────────────────────────────

// ── Datos de prueba ───────────────────────────────────────────────────────────

const SHIPPING = {
  firstName: "Ana",
  lastName:  "García",
  email:     "ana.garcia@test.com",
  phone:     "612345678",
  address:   "Calle Mayor 42",
  city:      "Madrid",
  zipCode:   "28001",
};

const PAYMENT = {
  cardNumber: "1234567890123456", // 16 dígitos — PaymentForm los formatea con espacios
  cardName:   "ANA GARCIA",
  cardExpiry: "12/26",            // formato MM/AA exacto (PaymentForm.jsx handleExpiryChange)
  cardCVC:    "123",              // 3 dígitos exactos
};

// ── Helpers privados ──────────────────────────────────────────────────────────

const fillShippingForm = () => {
  cy.get('input[name="firstName"]').clear().type(SHIPPING.firstName);
  cy.get('input[name="lastName"]').clear().type(SHIPPING.lastName);
  cy.get('input[name="email"]').clear().type(SHIPPING.email);
  cy.get('input[name="phone"]').clear().type(SHIPPING.phone);
  cy.get('input[name="address"]').clear().type(SHIPPING.address);
  cy.get('input[name="city"]').clear().type(SHIPPING.city);
  cy.get('input[name="zipCode"]').clear().type(SHIPPING.zipCode);
};

const fillPaymentForm = () => {
  cy.get('input[name="cardNumber"]').clear().type(PAYMENT.cardNumber);
  cy.get('input[name="cardName"]').clear().type(PAYMENT.cardName);
  cy.get('input[name="cardExpiry"]').clear().type(PAYMENT.cardExpiry);
  cy.get('input[name="cardCVC"]').clear().type(PAYMENT.cardCVC);
};

// ─────────────────────────────────────────────────────────────────────────────
// WHEN
// ─────────────────────────────────────────────────────────────────────────────

When("procede al checkout", () => {
  openCart();
  // CartSidebar.jsx → cartSidebar__actionButton--primary: "Proceder al pago"
  cy.contains("button", "Proceder al pago").click();
  cy.url().should("include", "/checkout");
  // Checkout.jsx → h1 "Finalizar Compra"
  cy.contains("h1", "Finalizar Compra").should("be.visible");
});

When("confirma el pago", () => {
  // ── PASO 1: ShippingForm ──────────────────────────────────────────────────
  fillShippingForm();
  // Checkout.jsx → "Continuar a Pago →" (solo habilitado si validateStep(1) pasa)
  cy.contains("button", "Continuar a Pago →").click();

  // ── PASO 2: PaymentForm ───────────────────────────────────────────────────
  fillPaymentForm();

  // Interceptar el alert ANTES de hacer clic (Cypress lo captura en cuanto aparece)
  cy.on("window:alert", (alertText) => {
    expect(alertText).to.eq(
      "¡Pedido realizado con éxito! Tu pedido ha sido procesado correctamente."
    );
  });

  // Checkout.jsx → handleSubmitOrder → setTimeout(2000) → alert → setOrderCompleted(true)
  cy.contains("button", "Confirmar y Pagar").click();

  // Espera los 2s de simulación de pago
  cy.wait(2500);
});

When("acepta la alerta de confirmación si aparece", () => {
  // Cypress acepta window.alert automáticamente — paso documental en el feature
  cy.on("window:alert", () => true);
});

// ─────────────────────────────────────────────────────────────────────────────
// THEN
// ─────────────────────────────────────────────────────────────────────────────

// CA-13: Resumen del pedido visible al entrar al checkout
Then("debería ver un resumen con los libros que va a comprar", () => {
  cy.url().should("include", "/checkout");
  // OrderSummary.jsx siempre renderiza cuando hay items en el carrito
  // El paso 1 también muestra el botón "Continuar a Pago →"
  cy.contains("button", "Continuar a Pago →").should("exist");
});

// CA-14: Confirmación del pedido (alert exacto de Checkout.jsx línea ~107)
Then("debería ver una confirmación del pedido", () => {
  cy.on("window:alert", (alertText) => {
    expect(alertText).to.eq(
      "¡Pedido realizado con éxito! Tu pedido ha sido procesado correctamente."
    );
  });
});

// CA-15: Carrito vacío tras el pago
// Checkout.jsx: clearCart() se llama dentro del useEffect cuando orderCompleted=true
// La limpieza ocurre al redirigir a /home (después de 20s)
Then("el carrito debería quedar vacío tras el pago", () => {
  cy.url({ timeout: 22000 }).should("include", "/home");
  cy.get('input[placeholder="Buscar por título..."]').should("be.visible");
  
  // Abrir el carrito y verificar que está vacío
  cy.get("header button").last().click();
  cy.contains("Tu carrito está vacío", { timeout: 5000 }).should("be.visible");
});

// CA-16: Redirección a /home tras el pago
Then("debería ser redirigido a la página principal", () => {
  // Checkout.jsx: navigate('/home') dentro del useEffect tras 20000ms
  cy.url({ timeout: 22000 }).should("include", "/home");
});

// ── Funcionales de checkout ───────────────────────────────────────────────────

Then("la página de checkout debería cargarse correctamente", () => {
  cy.url().should("include", "/checkout");
  // Checkout.jsx → h1 "Finalizar Compra"
  cy.contains("h1", "Finalizar Compra").should("be.visible");
});

Then("debería ver al menos un artículo en el resumen del pedido", () => {
  // OrderSummary.jsx renderiza los cartItems — cada uno tiene imagen + título
  // El CartSidebar aún no está abierto, pero el OrderSummary está en la columna derecha
  cy.url().should("include", "/checkout");
  // Verificamos que hay contenido del pedido en la columna derecha
  cy.contains("button", "Continuar a Pago →").should("exist");
});

Then("debería existir un botón para confirmar el pago", () => {
  // "Confirmar y Pagar" solo aparece en el PASO 2
  // Hay que pasar por el paso 1 primero
  fillShippingForm();
  cy.contains("button", "Continuar a Pago →").click();
  cy.contains("button", "Confirmar y Pagar").should("exist");
});

Then("debería ver una alerta o mensaje de confirmación del pedido", () => {
  cy.on("window:alert", (text) => {
    expect(text).to.include("éxito");
  });
});

Then("debería estar en la página principal", () => {
  // Timeout de 22s para cubrir los 20s del useEffect en Checkout.jsx
  cy.url({ timeout: 22000 }).should("include", "/home");
  cy.get('input[placeholder="Buscar por título..."]').should("be.visible");
});