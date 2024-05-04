const Orden = require('./orden.model')
const paginacion = require('../Specificaciones/Paginacion')

exports.crearOrden = (request, response) => {
  console.log(request)
  console.log('creando orden', request.auth)
  const newOrden = new Orden({
    ...request.body,
    user: request.user._id.toHexString()
  })
  newOrden
    .save()
    .then((res) => response.send(res))
    .catch((err) => console.log(err))
}

exports.updateOrden = async (request, response) => {
  if (request.body._id) {
    delete request.body.id
  }

  console.log(request.query)
  const ordenUpdate = await Orden.findByIdAndUpdate(
    request.params.id,
    request.body
  )

  if (ordenUpdate) return response.send(ordenUpdate)

  return response.json({ message: 'error al actualizar' })
}

exports.mostrarOrdenes = async (request, response) => {
  const ordenes = await paginacion(Orden.find({}), request.query)
  if (!ordenes) return response.json({ message: 'algo salio mal' })
  return response.send(ordenes)
}

exports.mostrarOrdenPorId = async (request, response) => {
  const orden = await Orden.findById(request.params.id)
  if (!orden) return response.json({ message: 'la orden no existe' })
  return response.send(orden)
}

exports.eliminarOrden = async (request, response) => {
  const orden = await Orden.findByIdAndDelete(request.params.id)
  return response.send(orden)
}
