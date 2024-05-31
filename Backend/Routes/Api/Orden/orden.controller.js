const Orden = require("./orden.model");
const paginacion = require("../Specificaciones/Paginacion");
const paypal = require("../PayPal/paypal.service");

exports.crearOrden = async (request, response) => {
  const cart = {
    ...request.body,
    direccion: request.user.Direccion.toHexString(),
  };

  const { ResponseJson } = await paypal.createOrden(cart);

  try {
    const newOrden = new Orden({
      ...request.body,
      id: ResponseJson.id,
      user: request.user._id.toHexString(),
      direccion: request.user.Direccion.toHexString(),
    });
    newOrden
      .save()
      .then((res) => response.send(res))
      .catch((err) => response.status(500).send(err));
  } catch (error) {
    return response.status(500).send("Ocurrio un Error");
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
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
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

exports.eliminarOrden = async (request, response) => {
  try {
    const orden = await Orden.findByIdAndDelete(request.params.id);
    return response.send(orden);
  } catch (error) {
    return response.send(error);
  }
};
