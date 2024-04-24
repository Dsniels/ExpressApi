
const redis = require('../../../config/redis');

exports.obtenerCarritoId = (request, response) => {
    const carritoID  = `carrito:${request.params.id}`;
    redis.LRANGE(carritoID, 0 ,-1, (err, productos)=>{
        if(err) return response.send(err);
        const parseProducts = productos.map(JSON.parse);
        return response.send(parseProducts);
    });
}

exports.updateCarrito = (request, response) =>{ 
    console.log(request);
    const carritoID = `carrito:${request.auth.id}`;
    const items = request.body.items
    items.forEach(element => {
        redis.rPush(carritoID, JSON.stringify(element)).then(()=>console.log('Items insertados: ', carritoID)).catch(err => console.log(err)); 
    });
    return response.send();
}