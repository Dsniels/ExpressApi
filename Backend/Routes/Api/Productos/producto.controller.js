const Producto = require('./producto.model');
const paginacion = require('../Specificaciones/Paginacion');


exports.registrarProducto = (request, response) => {
    
    try {
        Producto.findOne({name : request.body.name}).then(producto => {
        if(!producto){
            return response.status(400).json({name : 'Producto ya existe'});
        }
        const newProduct = new Producto({...request.body});
        newProduct.save().then(RESPONSE => response.send(RESPONSE)).catch(err => console.log(err));
        return null;
    });
        
    } catch (error) {
        return response.status(500).send('Ocurrió un error al obtener el producto');
    }

}


exports.getProduct = async (request, response) => {
    try {
        const producto = await Producto.findById(request.params.id).exec();
        if(!producto){
            return response.send(404);
        }
        return response.send(producto);
    } catch (error) {
        return response.status(500).send("Ocurrió un error al obtener el producto")
        
    }

}


exports.getProducts = async (request, response) => {

    try {
        const query = request.query;
        const exclude = ['sort', 'page', 'limit','pageSize'];
        const queryObj = {...query};
        exclude.forEach(element => {
            delete queryObj[element];
        });

        let consulta =  Producto.find(queryObj).sort(request.query.sort)
        consulta =  paginacion(consulta, query);
        const productos = await consulta;

        if(!productos){
            return response.send(404);
        }
        return response.send(productos);
        
    } catch (error) {
        return response.status(500).send("Ocurrió un error al obtener el producto")
    }

    
}



exports.updateProducto = async (request, response) => {
    try {
        const productoUpdate = await Producto.findByIdAndUpdate(request.params.id, request.body);
        if(!productoUpdate) return response.json({message:"El producto no existe"});
        return response.send(productoUpdate);
        
    } catch (error) {
        return response.status(500).send("Ocurrio un Error al actualizar Producto")
    }

}


exports.deleteProducto = async (request, response) => {
    try {
        await Producto.findByIdAndDelete(request.query.id);
        return response.status(200).send("Producto eliminado exitosamente");
        
    } catch (error) {
        return response.status(500).send("No se pudo eliminar el producto, intente mas tarde");
    }

}