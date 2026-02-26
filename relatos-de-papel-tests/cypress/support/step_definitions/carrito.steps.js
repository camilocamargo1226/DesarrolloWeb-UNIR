import { When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { openCart, goToHome } from "./landing.steps";

// ─────────────────────────────────────────
// WHEN
// ─────────────────────────────────────────

When("hace clic en el primer libro disponible", () => {
  cy.contains("button", "Ver detalle")
    .first()
    .click();

  cy.url().should("include", "/book/");
});

When("hace clic en el botón de añadir al carrito", () => {
  cy.contains("button", "Añadir al carrito")
    .click();

  // Validación estable (evitar depender solo de texto toast)
  cy.get("header button span", { timeout: 5000 })
    .should("exist");
});

When("navega de vuelta a la página principal", () => {
  goToHome();
});

When("elimina el primer libro del carrito", () => {
  openCart();

  cy.get('button[aria-label="Eliminar producto"]')
    .first()
    .click();

  cy.wait(300); // opcional si hay animación
});

When("elimina todos los libros del carrito", () => {
  openCart();

  cy.get('button[aria-label="Eliminar producto"]').then(($buttons) => {
    const total = $buttons.length;

    if (total > 0) {
      for (let i = 0; i < total; i++) {
        cy.get('button[aria-label="Eliminar producto"]')
          .first()
          .click();
      }
    }
  });
});

// ─────────────────────────────────────────
// THEN
// ─────────────────────────────────────────

Then("debería ver la vista de detalle del libro", () => {
  cy.url().should("include", "/book/");
});

Then("debería ver información del libro como título o descripción", () => {
  cy.get("h1, h2")
    .first()
    .should("be.visible")
    .and("not.be.empty");

  cy.get("p").should("exist");
});

Then("el libro debería aparecer en el carrito", () => {
  openCart();

  cy.contains("h2", "Tu Carrito")
    .should("be.visible");

  cy.get('button[aria-label="Eliminar producto"]')
    .should("have.length.greaterThan", 0);
});

Then("el carrito debería mostrar al menos un artículo", () => {
  cy.get('button span[class*="cartBadge"]')
    .invoke("text")
    .then((text) => {
      const numero = parseInt(text);
      expect(numero).to.be.greaterThan(0);
    });
});

Then("el carrito debería ser visible en la página", () => {
  cy.get("header button")
    .should("be.visible");
});

Then("el carrito debería estar vacío", () => {
  cy.get('button span[class*="cartBadge"]').should("not.exist");
});

Then("el carrito debería estar vacío o tener menos artículos", () => {
  cy.get("header button span").then(($span) => {
    if ($span.length === 0) {
      // Caso 1: No hay badge - carrito vacío
      cy.log("✅ Carrito vacío (sin badge)");
      expect(true).to.be.true;
    } else {
      const texto = $span.text().trim();
      cy.log(`🔍 Texto del badge: "${texto}"`);
      
      // Caso 2: Badge visible con texto
      if (texto === "") {
        cy.log("✅ Badge vacío - carrito vacío");
        expect(true).to.be.true;
      } else {
        const numero = parseInt(texto);
        cy.log(`🔍 Número interpretado: ${numero}`);
        
        // Si es NaN, lo tratamos como 0
        if (isNaN(numero)) {
          cy.log("⚠️ Texto no numérico, tratando como vacío");
          expect(true).to.be.true;
        } else {
          expect(numero).to.be.lessThan(1);
        }
      }
    }
  });
});