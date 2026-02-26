import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS COMPARTIDOS
// Exportados para que otros archivos de steps los puedan reutilizar
// ─────────────────────────────────────────────────────────────────────────────
// Helper para cargar la tienda UNA SOLA VEZ usando sesión
export const setupTienda = () => {
  cy.session('tienda-cargada', () => {
    // Esta lógica se ejecuta solo UNA VEZ por prueba
    cy.visit("/");
    
    // Esperar redirección automática (5 segundos)
    cy.wait(5000);
    
    // Verificar que estamos en la tienda
    cy.url().should("include", "/home");
    cy.get('input[placeholder="Buscar por título..."]', { timeout: 10000 })
      .should("be.visible");
    cy.get('[class*="bookCard"]', { timeout: 10000 })
      .should("have.length.greaterThan", 0);
  });
  
  // Después de restaurar la sesión, visitamos la raíz
  // La app en el cliente manejará la redirección a /home
  cy.visit("/");
  
  // Esperar a que la app se hidrate y redirija
  cy.url().should("include", "/home", { timeout: 10000 });
  cy.get('input[placeholder="Buscar por título..."]', { timeout: 10000 })
    .should("be.visible");
};
export const goToHome = () => {
  cy.visit("/");
  cy.url().should("include", "/home")
  cy.get('input[placeholder="Buscar por título..."]', { timeout: 10000 }).should("be.visible");
};

export const enterTiendaDirecto = () => {
  cy.visit("/");

  // Esperar que el botón exista
  cy.contains("button", "Entrar ahora", { timeout: 10000 })
    .should("be.visible")
    .click();

  // Verificar redirección correcta
  cy.url().should("include", "/home");

  // Verificar que cargó la tienda
  cy.get('input[placeholder="Buscar por título..."]', { timeout: 10000 })
    .should("be.visible");
};

export const openCart = () => {
  cy.contains("header button", "🛒")
    .click();

  cy.contains("Tu Carrito")
    .should("be.visible");
};

export const addFirstBookToCart = () => {
  goToHome();
  // BookCard.jsx → botón con texto exacto "Añadir al carrito"
  cy.contains("button", "Añadir al carrito").first().click();
};

// ─────────────────────────────────────────────────────────────────────────────
// GIVEN — compartidos con todos los features
// ─────────────────────────────────────────────────────────────────────────────

Given("que el usuario navega a la página de inicio", () => {
  cy.visit("/");
  // LandingPage.jsx: h1 + countdown visible
  cy.get("h1").contains("Relatos de Papel").should("be.visible");
  cy.get('[class*="countdownNumber"]').should("be.visible");
});
Given("que el usuario está directamente en la tienda", () => {
  // Esto evita la landing page por completo
  cy.visit("/home");
  cy.get('input[placeholder="Buscar por título..."]', { timeout: 10000 })
    .should("be.visible");
});

/* Given("que el usuario está en la página principal", () => {
  goToHome();
}); */

Given("tiene al menos un libro en el carrito", () => {
  addFirstBookToCart();
});

// ─────────────────────────────────────────────────────────────────────────────
// WHEN — landing
// ─────────────────────────────────────────────────────────────────────────────

When("espera {int} segundos sin realizar ninguna acción", (seconds) => {
  cy.wait(seconds * 1000);
});

// ─────────────────────────────────────────────────────────────────────────────
// THEN — landing
// ─────────────────────────────────────────────────────────────────────────────

Then("debería ver la vista de acceso o landing", () => {
  // LandingPage.jsx: h1 "Relatos de Papel" + span countdown
  cy.get("h1").contains("Relatos de Papel").should("be.visible");
  cy.get('[class*="countdownNumber"]').should("be.visible");
});

Then("debería ser redirigido automáticamente a la página principal", () => {
  // LandingPage.jsx: navigate('/home') tras setTimeout(5000ms)
  cy.url({ timeout: 2000 }).should("include", "/home");
});

Then("debería ver libros disponibles en la página principal", () => {
  // HomePage.jsx: h1 "Nuestra Colección" + BookCards con botón "Añadir al carrito"
  cy.contains("h1", "Nuestra Colección").should("be.visible");
  cy.contains("button", "Añadir al carrito").should("exist");
});

// ── Funcionales de landing ────────────────────────────────────────────────────

Then("la página debería cargar sin errores", () => {
  cy.get("body").should("be.visible").and("not.be.empty");
});

Then("el título de la página debería estar presente", () => {
  cy.title().should("not.be.empty");
});

Then("la URL debería haber cambiado a la página principal", () => {
  cy.url().should("include", "/home");
});