const redis = require('../../../config/redis')

exports.obtenerCarritoId = async (request, response) => {
  try {
    const carrito = await redis.get(`carrito:${request.params.id}`)

    if (carrito) {
      return response.status(200).send(JSON.parse(carrito))
    } else {
      return response.status(404)
    }
  } catch (error) {
    return response.status(500).send(error)
  }
}

exports.updateCarrito = async (request, response) => {
  try {
    const items = JSON.stringify(request.body.items)
    const carrito = await redis.set(
      `carrito:${(request.user._id.toHexString(), items)}`
    )
    if (!carrito) throw new Error('Error al actualizar el carrito')
    return response
      .status(200)
      .send(carrito)
      .JSON({ message: 'carrito actualizado' })
  } catch (error) {
    return response.send(error)
  }
}

exports.deleteCarrito = async (request, response) => {
  try {
    return response.send(
      redis
        .del(`carrito:${request.params.id}`)
        .then(() => console.log('Carrito eliminado'))
        .catch((err) => console.log(err))
    )
  } catch (error) {
    return response.send(error).status(400)
  }
}
