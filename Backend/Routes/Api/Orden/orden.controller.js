
const Orden = require('./orden.model');



exports.crearOrden = (request, response) => {
    const newOrden = new Orden({...request.body, user : request.user._id  });
    newOrden.save().then(res => response.send(res)).catch(err => console.log(err));
};


exports.updateOrden = async (request, response) => {
    if(request.body._id){
        delete request.body.id;
    }
    const ordenUpdate = await Orden.findByIdAndUpdate(request.query.id, request.body)

    if(ordenUpdate) return response.send(ordenUpdate);

    return response.json({message : 'error al actualizar'});
}


exports.mostrarOrdenes = async (request, response) => {
    const ordenes = await Orden.find({});
    if(!ordenes) return response.json({message : 'algo salio mal'});
    return response.send(ordenes);
}

exports.orden = async (request, response) => {
    const orden = await Orden.findById(request.query.id);
    if(!orden) return response.json({message : 'la orden no existe'});
    return response.send(orden);
}

exports.eliminarOrden = async (request, response) => {
    const orden = await Orden.findByIdAndDelete(request.query.id);
    return response.send(orden);
}

