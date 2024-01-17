# Bienes_Raices2k24_Backend

REST API MVC - Node Express MySQL

## Actualizaciones y Mejoras

> [!IMPORTANT]
> En esta versión, se realizaron importantes mejoras y adiciones en el manejo de propiedades, centrada especialmente en la gestión de imágenes. A continuación, se resumen las principales actualizaciones:

1. **Carga de hasta 6 imágenes por propiedad:**
   Ahora es posible adjuntar hasta 6 imágenes a cada propiedad. Esto proporciona una experiencia más rica y visual para los usuarios al mostrar múltiples perspectivas de la propiedad.

2. **Validaciones con Middleware:**
   Se implementaron nuevas capas de validación utilizando middleware para garantizar que solo se carguen archivos de imagen permitidos y que se cumplan ciertos criterios de tamaño y formato.

3. **Actualizaciones asincrónicas:**
   Las operaciones de creación, actualización y eliminación de propiedades ahora se realizan de forma asincrónica. Cuando actualizas una propiedad, las imágenes antiguas se eliminan automáticamente y se reemplazan por las nuevas. Al eliminar una propiedad, todas las imágenes asociadas también se eliminan de manera eficiente.

4. **Mejoras en la integración con la base de datos:**
   Se realizaron ajustes en las consultas a la base de datos para garantizar una gestión precisa de las rutas de las imágenes, facilitando la actualización y eliminación sin problemas.

Estas mejoras están diseñadas para hacer que la gestión de propiedades y sus imágenes sea más robusta y fácil de usar.
