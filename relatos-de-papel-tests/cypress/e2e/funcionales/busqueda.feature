# language: es
Característica: Funcional - Barra de búsqueda
  Verificar que la barra de búsqueda responde correctamente a la entrada del usuario

  Antecedentes:
    Dado que el usuario está en la página principal

  Escenario: La barra de búsqueda existe y está habilitada
    Entonces debería existir una barra de búsqueda en la página
    Y la barra de búsqueda debería estar habilitada para escribir

  Escenario: Escribir en la búsqueda actualiza la lista de libros
    Cuando escribe "a" en la barra de búsqueda
    Entonces la lista de libros debería actualizarse

  Escenario: El campo de búsqueda retiene el texto escrito
    Cuando escribe "Harry" en la barra de búsqueda
    Entonces el valor del campo de búsqueda debería ser "Harry"
