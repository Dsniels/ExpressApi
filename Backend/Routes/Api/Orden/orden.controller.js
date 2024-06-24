const Orden = require("./orden.model");
const paginacion = require("../Specificaciones/Paginacion");
const paypal = require("../PayPal/paypal.service");
const redis = require("../../../config/redis");
const Producto = require("../Productos/producto.model");

exports.crearOrden = async (request, response) => {
  try {
    const carritoId = request.body.CarritoId;
    // 2. Obtener el carrito desde Redis
    const carrito = JSON.parse(await redis.get(carritoId));
    console.log("Carrito Redis", carrito);

    // 3. Asegurarse de que el carrito es un array de objetos de tipo Producto
    if (!Array.isArray(carrito)) {
      throw new Error("El carrito no es un array válido.");
    }

    // 4. Crear una lista vacía para almacenar los productos validados
    const productosValidados = [];
    let total = 0;
    // 5. Iterar sobre cada producto en el carrito
    for (const producto of carrito) {
      // a. Usar el id del producto para buscarlo en la base de datos
      const productoDB = await Producto.findById(producto.id);
      // b. Si el producto existe, agregarlo a la lista de productos validados
      if (productoDB) {
        const productoValidado = {
          ...producto,
          precio: productoDB.precio, // Reemplazar el precio con el de la base de datos
        };
        total += productoDB.precio * producto.quantity;
        console.log("Producto databse", productoDB);
        productosValidados.push(productoValidado);
      } else {
        console.log(
          `Producto con ID ${producto.id} no encontrado en la base de datos.`,
        );
      }
    }

    console.log("Productos Validos", productosValidados);
    const cart = {
      ...request.body,
      direccion: request.user.Direccion.toHexString(),
    };

    const data = await paypal.createOrden(cart);
    console.log("🚀 ~ exports.crearOrden= ~ data:", data);
    await new Orden({ ...cart, paypalID: data.id, Total: total }).save();
    response.json(data);
  } catch (error) {
    console.error("Error creating order:", error);
    response.status(500).json({ error: error.message });
  }
};

exports.updateOrden = async (request, response) => {
  try {
    if (request.body._id) {
      delete request.body.id;
    }
    const orden = await Orden.findByIdAndUpdate(
      request.params.id,
      request.body,
    );
    if (orden) return response.status(200).send(orden);
    else throw new Error("Orden no encontrada");
  } catch (error) {
    return response.status(500).send(error);
  }
};

exports.mostrarOrdenes = async (request, response) => {
  try {
    const ordenes = await paginacion(Orden.find({}), request.query);
    if (ordenes) return response.status(200).send(ordenes);
    else throw new Error("No hay ordenes que mostrar");
  } catch (error) {
    return response.send(error);
  }
};

exports.captureOrden = async (req, res) => {
  try {
    const { orderID } = req.params;
    console.log("🚀 ~ exports.captureOrden= ~ orderID:", orderID);
    const response = await paypal.captureOrder(orderID);
    console.log("🚀 ~ exports.captureOrden= ~ response:", response);
    const { jsonResponse, httpStatusCode } = response;
    console.log("🚀 ~ exports.captureOrden= ~ jsonResponse:", jsonResponse);
    const orden = await Orden.findOneAndUpdate(
      { paypalID: orderID },
      { pagado: "Pagado" },
    );
    console.log("🚀 ~ exports.captureOrden= ~ orden:", orden);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

exports.mostrarOrdenPorId = async (request, response) => {
  try {
    const orden = await Orden.findById(request.params.id);
    if (!orden) throw new Error("No existe la orden");
    return response.status(200).send(orden);
  } catch (error) {
    return response.send(error);
  }
};

exports.userOrdenes = async (request, response) => {
  try {
    const ordenes = await Orden.find({ user: request.user._id });
  } catch (error) {}
};

exports.eliminarOrden = async (request, response) => {
  try {
    const orden = await Orden.findByIdAndDelete(request.params.id);
    return response.send(orden);
  } catch (error) {
    return response.send(error);
  }
};
