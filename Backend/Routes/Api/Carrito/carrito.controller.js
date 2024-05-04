const redis = require('../../../config/redis')

exports.obtenerCarritoId = async (request, response) => {
  const carritoID = `carrito:${request.params.id}`
  const carrito = await redis.get(carritoID)
  if (!carrito) return response.status(404)
  return response.send(JSON.parse(carrito))
}

exports.updateCarrito = async (request, response) => {
  console.log(request.user._id.toHexString())
  const carritoID = `carrito:${request.user._id.toHexString()}`
  const items = JSON.stringify(request.body.items)
  const carrito = await redis.set(carritoID, items)
  if (!carrito) return response.send({ message: 'no hay carrito' })
  return response.send({ message: 'carrito actualizado', id: carritoID })
}

exports.deleteCarrito = async (request, response) => {
  const carritoId = `${request.params.id}`
  return response.send(
    redis
      .del(carritoId)
      .then(() => {
        console.log('eliminado')
      })
      .catch((err) => console.log(err))
  )
}
