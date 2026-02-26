# language: es
Característica: Vista de acceso - Landing Page
  Como usuario que llega al sitio por primera vez
  Quiero ver una página de bienvenida
  Para conocer la aplicación antes de entrar

  # CA-01: Redirección automática tras 5 segundos sin interacción
  Escenario: El usuario es redirigido automáticamente tras 5 segundos sin interacción
    Dado que el usuario navega a la página de inicio
    Cuando espera 6 segundos sin realizar ninguna acción
    Entonces debería ser redirigido automáticamente a la página principal
    Y debería ver libros disponibles en la página principal

  # CA-02: La landing muestra contenido de bienvenida
  Escenario: El usuario ve la landing page al llegar al sitio
    Dado que el usuario navega a la página de inicio
    Entonces debería ver la vista de acceso o landing
