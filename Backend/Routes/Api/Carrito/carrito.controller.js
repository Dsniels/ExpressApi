const redis = require('../../../config/redis')

exports.obtenerCarritoId = async (request, response) => {
  try {
    const carrito = await redis.get(`${request.user._id}`)

    if (carrito !== null) {
      return response.status(200).json({items : JSON.parse(carrito), id : request.user._id})
    } else {
      await redis.setEx(`${request.user._id}`, 3000, '[]')
      return response.status(200).json({items : [], id : request.user._id})
    }
  } catch (error) {
    return response.status(500).send(error)
  }
}


exports.updateCarrito = async (request, response) => {
  try {
    const items = JSON.stringify(request.body.items)
    await redis.setEx(`${request.user._id}`, 30000, items)
    const carrito = await redis.get(`${request.user._id}`)
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
