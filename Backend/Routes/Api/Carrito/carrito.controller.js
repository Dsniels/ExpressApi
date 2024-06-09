const redis = require('../../../config/redis')

exports.obtenerCarritoId = async (request, response) => {
  try {
    const carrito = await redis.get(`${request.params.id}`)

    console.log("🚀 ~ exports.obtenerCarritoId= ~ carrito:", carrito)
    if (carrito !== null) {
      return response.status(200).send(JSON.parse(carrito))
    } else {
      return response.status(404).json({error : 'error'})
    }
  } catch (error) {
    return response.status(500).send(error)
  }
}


exports.updateCarrito = async (request, response) => {
  try {
    console.log(request.body)
    const items = JSON.stringify(request.body.items)
    console.log('carrito item', items);
    await redis.setEx(`${request.body.id}`, 30000, items)
    console.log('carritostring');
    const carrito = await redis.get(`${request.body.id}`)
    console.log(carrito);
    if (!carrito) throw new Error('Error al actualizar el carrito')
    return response.status(200).json({id : request.user._id, items: JSON.parse(carrito)})
  } catch (error) {
    return response.send(error)
  }
}


exports.deleteCarrito = async (request, response) => {
  try {
    return response.send(
      await redis
        .del(`${request.params.id}`)
        .then(() => console.log('Carrito eliminado'))
        .catch((err) => console.log(err))
    )
  } catch (error) {
    return response.send(error).status(400)
  }
}
