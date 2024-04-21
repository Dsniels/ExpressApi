
const Orden = require('./orden.model');



exports.crearOrden = (request, response) => {
    const newOrden = new Orden({...request.body, user : request.user._id  });
    newOrden.save().then(res => response.send(res)).catch(err => console.log(err));
};

