import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

// ─────────────────────────────────────────────────────────────────────────────
// WHEN
// ─────────────────────────────────────────────────────────────────────────────

When("escribe un término de búsqueda en la barra de búsqueda", () => {
  cy.get('input[placeholder="Buscar por título..."]', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type("Hobbit");
});

When("escribe {string} en la barra de búsqueda", (term) => {
  cy.get('input[placeholder="Buscar por título..."]', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(term);
});

When("borra el texto de la barra de búsqueda", () => {
  cy.get('input[placeholder="Buscar por título..."]')
    .clear();
});

// ─────────────────────────────────────────────────────────────────────────────
// THEN
// ─────────────────────────────────────────────────────────────────────────────

Then("debería ver únicamente los libros cuyo título contiene el término buscado", () => {
  // Esperar a que los libros carguen
  cy.get('[class*="bookCard"]', { timeout: 10000 })
    .should('have.length.greaterThan', 0);
  
  // Verificar el subtítulo
  cy.get('[class*="home__subtitle"]')
    .should("contain.text", "encontrado");
});

Then("no debería ver ningún libro en los resultados", () => {
  // Verificar mensaje de vacío
  cy.contains("h3", "No se encontraron libros", { timeout: 10000 })
    .should("be.visible");
  
  // Verificar que no hay libros
  cy.get('[class*="bookCard"]').should('not.exist');
});

Then("debería ver todos los libros disponibles nuevamente", () => {
  // Esperar a que los libros carguen
  cy.get('[class*="bookCard"]', { timeout: 10000 })
    .should('have.length.greaterThan', 1);
  
  // Verificar subtítulo
  cy.get('[class*="home__subtitle"]')
    .should("not.contain.text", 'para "');
});

// Validaciones funcionales
Then("debería existir una barra de búsqueda en la página", () => {
  cy.get('input[placeholder="Buscar por título..."]')
    .should("exist");
});

Then("la barra de búsqueda debería estar habilitada para escribir", () => {
  cy.get('input[placeholder="Buscar por título..."]')
    .should("be.visible")
    .and("not.be.disabled");
});

Then("la lista de libros debería actualizarse", () => {
  cy.get('[class*="home__subtitle"]')
    .should("be.visible");
  
  cy.get('[class*="bookCard"]')
    .should('exist');
});

Then('el valor del campo de búsqueda debería ser {string}', (value) => {
  cy.get('input[placeholder="Buscar por título..."]')
    .should("have.value", value);
});