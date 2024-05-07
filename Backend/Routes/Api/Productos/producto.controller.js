const Producto = require('./producto.model')
const paginacion = require('../Specificaciones/Paginacion')

exports.registrarProducto = (request, response) => {
  console.log('agregando producto')
  Producto.findOne({ name: request.body.name }).then((producto) => {
    if (producto) {
      return response.status(400).json({ name: 'Producto ya existe' })
    }
    const newProduct = new Producto({ ...request.body })
    newProduct
      .save()
      .then((RESPONSE) => response.send(RESPONSE))
      .catch((err) => console.log(err))
  })
}

exports.getProduct = async (request, response) => {
  const producto = await Producto.findById(request.params.id).exec()
  if (!producto) {
    return response.send(404)
  }
  return response.send(producto)
}

exports.getProducts = async (request, response) => {
  const query = request.query
  const exclude = ['sort', 'page', 'limit', 'pageSize']
  const queryObj = { ...query }
  exclude.forEach((element) => {
    delete queryObj[element]
  })

  let consulta = Producto.find(queryObj).sort(request.query.sort)
  consulta = paginacion(consulta, query)
  const productos = await consulta

  if (!productos) {
    return response.send(404)
  }
  return response.send(productos)
}

exports.updateProducto = async (request, response) => {
  console.log(request.query)
  console.log(request.params)
  const productoUpdate = await Producto.findByIdAndUpdate(
    request.params.id,
    request.body
  )

  if (!productoUpdate) return response.json({ message: 'error al actualizar' })

  return response.send(productoUpdate)
}

exports.deleteProducto = async (request, response) => {
  const productoDelete = await Producto.findByIdAndDelete(request.query.id)
  return response.send(productoDelete).json({ message: 'producto elimando' })
}
