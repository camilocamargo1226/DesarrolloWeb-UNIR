# language: es
Característica: Proceso de checkout y pago en dos pasos
  Como usuario con libros en el carrito
  Quiero completar mi compra rellenando mis datos de envío y pago
  Para recibir los libros que he seleccionado

  Antecedentes:
    Dado que el usuario está en la página principal
    Y tiene al menos un libro en el carrito

  # CA-13: Ver resumen del pedido al entrar al checkout
  Escenario: El usuario ve el resumen de su pedido al entrar al checkout
    Cuando procede al checkout
    Entonces debería ver un resumen con los libros que va a comprar

  # CA-14 + CA-15 + CA-16: Flujo completo de pago
  Escenario: El usuario completa el pago y es redirigido al inicio con carrito vacío
    Cuando procede al checkout
    Y confirma el pago
    Entonces debería ver una confirmación del pedido
    Y el carrito debería quedar vacío tras el pago
    Y debería ser redirigido a la página principal
