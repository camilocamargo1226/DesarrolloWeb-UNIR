# language: es
Característica: Búsqueda de libros por título
  Como usuario de la tienda
  Quiero poder buscar libros por título
  Para encontrar rápidamente el libro que deseo comprar

  Antecedentes:
    Dado que el usuario está en la página principal

  # CA-03: La barra de búsqueda filtra correctamente
  Escenario: El usuario busca un libro por título y obtiene resultados
    Cuando escribe un término de búsqueda en la barra de búsqueda
    Entonces debería ver únicamente los libros cuyo título contiene el término buscado

  # CA-04: Búsqueda sin resultados muestra estado vacío
  Escenario: El usuario busca un término que no existe en ningún título
    Cuando escribe "xyzabc123" en la barra de búsqueda
    Entonces no debería ver ningún libro en los resultados

  # CA-05: Limpiar la búsqueda restaura todos los libros
  Escenario: El usuario borra la búsqueda y vuelven todos los libros
    Cuando escribe un término de búsqueda en la barra de búsqueda
    Y borra el texto de la barra de búsqueda
    Entonces debería ver todos los libros disponibles nuevamente
