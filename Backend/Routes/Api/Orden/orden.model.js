const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const OrdenSchema = new Schema({
    Total :{
        type : Number,
        required : true,
    },
    statusPago : {
        type: String,
        required : true,
        default : 'No pagado'
    },
    Estado : {
        type : String,
        required : true
    },
    Ciudad : {
        type : String,
        required : true
    },
    CodigoPostal : {
        type : Number,
        required : true
    },
    Colonia : {
        type : String,
        required : true
    },
    Calle : {
        type : String,
        required : true
    },
    Productos : [{type : Schema.ObjectId, ref : 'Producto'}],
    user : {
        type : Schema.ObjectId,
        ref : 'User'
    }
});
module.exports = Orden = mongoose.model('Orden', OrdenSchema);