
const Orden = require('./orden.model');
const paginacion = require('../Specificaciones/Paginacion');


exports.crearOrden = (request, response) => {
    const newOrden = new Orden({...request.body, user : request.auth.id  });
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
    const ordenes = await paginacion(Orden.find({}), request.query);
    if(!ordenes) return response.json({message : 'algo salio mal'});
    return response.send(ordenes);
}

exports.mostrarOrdenPorId = async (request, response) => {
    const orden = await Orden.findById(request.query.id);
    if(!orden) return response.json({message : 'la orden no existe'});
    return response.send(orden);
}

exports.eliminarOrden = async (request, response) => {
    const orden = await Orden.findByIdAndDelete(request.query.id);
    return response.send(orden);
}

