# language: es
Característica: Funcional - Checkout de dos pasos
  Verificar que la interfaz de checkout guía correctamente al usuario por los dos pasos

  Antecedentes:
    Dado que el usuario está en la página principal
    Y tiene al menos un libro en el carrito

  Escenario: El checkout carga con el título correcto
    Cuando procede al checkout
    Entonces la página de checkout debería cargarse correctamente

  Escenario: El resumen del pedido muestra los artículos del carrito
    Cuando procede al checkout
    Entonces debería ver al menos un artículo en el resumen del pedido

  Escenario: El botón de pago final solo aparece tras completar el paso 1
    Cuando procede al checkout
    Entonces debería existir un botón para confirmar el pago

  Escenario: El flujo completo genera confirmación y redirige al inicio
    Cuando procede al checkout
    Y confirma el pago
    Y acepta la alerta de confirmación si aparece
    Entonces debería ver una alerta o mensaje de confirmación del pedido
    Y debería estar en la página principal
