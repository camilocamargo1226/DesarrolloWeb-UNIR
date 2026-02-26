// Soporte global para todos los tests E2E
// Evita que errores no capturados de la app React rompan los tests
Cypress.on("uncaught:exception", () => false);
