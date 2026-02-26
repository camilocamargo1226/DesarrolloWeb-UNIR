import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { enterTiendaDirecto } from "./landing.steps";

Given("que el usuario está en la página principal", () => {
  enterTiendaDirecto();
});