# ExpressApi Plantilla Ecommerce con MongoDb

**abrir un Issues para sugerencias o ayuda**

**en el archivo keys ingresar la url de mongodb, secretOrKey para token y array con los roles, de este modo:**

```js
module.exports = {
  mongoUrl: "mongodb+url",
  secretOrKey: "secret",
  userRoles: ["user", "manager"],
};
```

**Requiere Redis para almacenar el carrito compra, modificar archivo /config/redis para cambiar la cadena de conexion**

## Endpoints

- Usuarios _al iniciar sesion o registrarse se crea el token con el role definido_

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
  - "/api/ordenes/" : Obtener todas las ordenes requiere role "manager", parametros de query para filtrar y ordenar :
    - sort
    - page
  - "/api/ordenes/:id" : Obtener una orden por su Id requiere role "user"
  - "/api/ordenes/crearorden" : crear una orden requiere role "user" y enviar los datos de la orden segun orden.model.js por medio json en body
  - "/api/ordenes/actualizar/:id" : Actualizar una orden por id requiere role "manager" y enviar data actualizada por medio json
  - "/api/ordenes/eliminar/:id" : Eliminar una orden por medio de Id requiere role "manager"
