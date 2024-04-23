# ExpressApi

## Endpoints
 - Usuarios
   - "/api/users/": 
       Informacion del usuario  
   - "api/users/all": 
       Obtener todos los usuarios requiere role "manager"
   - "api/users/login": 
       Iniciar sesion
   - "/api/users/registrar": 
       Crear cuenta
       enviar Json con datos segun user.model.js
 - Productos
   - "/api/productos/?" : Obtener todos los productos parametros de query para filtrar y ordenar
    - sort
    - page
  - "/api/productos/:id" : Obtener producto por id
  - "/api/productos/agregar" : Agregar un producto, insertar la data requerida segun producto.model.js
  - "/api/productos/actualizar/:id" : Actualizar un producto por id, enviar en el body data actualizada del producto
  - "/api/eliminar/?id=" : Elimina un producto por id
 - Ordenes
