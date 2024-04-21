
const Orden = require('./orden.model');

exports.crearOrden = (request, response) => {
    const {Total, EstatusPago, Estado, Ciudad, CodigoPostal, Colonia, Calle, Productos} = request.body;
    const newOrden = new Orden({
        Total, Estado, EstatusPago, Ciudad, CodigoPostal, Colonia, Calle, Productos
    });
    newOrden.save().then(res => response.send(res)).catch(err => console.log(err));
};

