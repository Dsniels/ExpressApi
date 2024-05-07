# ExpressApi Plantilla Ecommerce con MongoDb

**abrir un Issues para sugerencias o ayuda**


**en el archivo .env ingresar la url de mongodby redis**
```
MONGO_URL = mongodb+srv://dsnilesalazr:Dasa270512@cluster0.y2dzttg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
REDIS_URL=redis://:UZ2J9W8iGDZoC6lLSayoUPo7nlmtpr2a@redis-11042.c277.us-east-1-3.ec2.redns.redis-cloud.com:11042
```

**en el archivo keys secretOrKey para token y array con los roles, de este modo:**


``` js
module.exports = {
    secretOrKey : 'secret',
    userRoles: ['user', 'manager']
};
```

**Requiere Redis para almacenar el carrito compra, modificar archivo /config/redis para cambiar la cadena de conexion**


## Endpoints
 - Usuarios *al iniciar sesion o registrarse se crea el token con el role definido*
   
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
