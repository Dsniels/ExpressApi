const Orden = require('./orden.model')
const paginacion = require('../Specificaciones/Paginacion')

exports.crearOrden = (request, response, next) => {
  try {
    const newOrden = new Orden({
      ...request.body,
      user: request.user._id.toHexString()
    })
    next();
    return response.send(
      newOrden
        .save()
        .then((res) => response.send(res))
        .catch((err) => response.send(err))
    )
  } catch (error) {
    next();
    return response.status(500).send('Ocurrio un Error')
  }
}

exports.updateOrden = async (request, response, next) => {
  try {
    if (request.body._id) {
      delete request.body.id
    }
    const orden = await Orden.findByIdAndUpdate(
      request.params.id,
      request.body
    )
    next();
    if (orden) return response.status(200).send(orden)
    else throw new Error('Orden no encontrada')
  } catch (error) {
    next();
    return response.status(500).send(error)
  }
}

exports.mostrarOrdenes = async (request, response, next) => {
  try {
    const ordenes = await paginacion(Orden.find({}), request.query);
    next();
    if (ordenes) return response.status(200).send(ordenes)
    else throw new Error('No hay ordenes que mostrar')
  } catch (error) {
    next();
    return response.send(error)
  }
}

exports.mostrarOrdenPorId = async (request, response,  next) => {
  try {
    const orden = await Orden.findById(request.params.id);
    if (!orden) throw new Error('No existe la orden');
    next();
    return response.status(200).send(orden);
  } catch (error) {
    next();
    return response.send(error)
  }
}

exports.eliminarOrden = async (request, response, next) => {
  try {
    const orden = await Orden.findByIdAndDelete(request.params.id);
    next();
    return response.send(orden);
  } catch (error) {
    next();
    return response.send(error)
  }
}
