const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://unir-desarrollosoftware.vercel.app",
    specPattern: "cypress/e2e/**/*.feature",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      );
      return config;
    },
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    taskTimeout: 25000,
    supportFile: "cypress/support/e2e.js",
    // Forzar Chrome como navegador
    browser: {
      name: 'chrome',
      family: 'chromium',
      channel: 'stable'
    }
  },
  // También puedes ponerlo a este nivel
  browser: 'chrome'
});