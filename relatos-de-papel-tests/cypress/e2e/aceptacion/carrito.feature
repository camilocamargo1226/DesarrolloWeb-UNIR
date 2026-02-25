# language: es
Característica: Gestión del carrito de compras
  Como usuario de la tienda
  Quiero poder añadir y eliminar libros del carrito
  Para gestionar mi compra antes de pagar

  Antecedentes:
    Dado que el usuario está en la página principal

  # CA-06: Clic en libro navega al detalle
  Escenario: El usuario hace clic en un libro y ve su detalle
    Cuando hace clic en el primer libro disponible
    Entonces debería ver la vista de detalle del libro
    Y debería ver información del libro como título o descripción

  # CA-07 + CA-08: Añadir libro al carrito desde el detalle
  Escenario: El usuario añade un libro al carrito desde la vista de detalle
    Cuando hace clic en el primer libro disponible
    Y hace clic en el botón de añadir al carrito
    Entonces el libro debería aparecer en el carrito

  # CA-09: El badge del carrito se actualiza
  Escenario: El contador del header refleja los libros añadidos
    Cuando hace clic en el primer libro disponible
    Y hace clic en el botón de añadir al carrito
    Entonces el carrito debería mostrar al menos un artículo

  # CA-10: El carrito es visible en la página principal
  Escenario: El botón del carrito está visible en la página principal
    Entonces el carrito debería ser visible en la página

  # CA-11: Eliminar un libro del carrito
  Escenario: El usuario elimina un libro del carrito
    Cuando hace clic en el primer libro disponible
    Y hace clic en el botón de añadir al carrito
    Y navega de vuelta a la página principal
    Y elimina el primer libro del carrito
    Entonces el carrito debería estar vacío o tener menos artículos

  # CA-12: Carrito completamente vacío
  Escenario: El carrito queda vacío tras eliminar todos los libros
    Cuando hace clic en el primer libro disponible
    Y hace clic en el botón de añadir al carrito
    Y navega de vuelta a la página principal
    Y elimina todos los libros del carrito
    Entonces el carrito debería estar vacío
