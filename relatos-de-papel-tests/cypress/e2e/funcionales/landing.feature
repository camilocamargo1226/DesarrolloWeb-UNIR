# language: es
Característica: Funcional - Landing Page y navegación inicial
  Verificar que la landing carga correctamente y la redirección funciona

  Escenario: La landing carga y muestra contenido visual correcto
    Dado que el usuario navega a la página de inicio
    Entonces la página debería cargar sin errores
    Y el título de la página debería estar presente
    Y debería ver la vista de acceso o landing

  Escenario: La redirección automática ocurre tras 5 segundos
    Dado que el usuario navega a la página de inicio
    Cuando espera 6 segundos sin realizar ninguna acción
    Entonces la URL debería haber cambiado a la página principal
