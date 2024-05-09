const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ordenItem = new Schema({
  name: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    require: true
  }
})

const OrdenSchema = new Schema({
  Total: {
    type: Number,
    required: true
  },
  statusPago: {
    type: String,
    required: true,
    default: 'No pagado'
  },
  Estado: {
    type: String,
    required: true
  },
  Ciudad: {
    type: String,
    required: true
  },
  CodigoPostal: {
    type: Number,
    required: true
  },
  Colonia: {
    type: String,
    required: true
  },
  Calle: {
    type: String,
    required: true
  },
  items: [ordenItem],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
})
module.exports = Orden = mongoose.model('Orden', OrdenSchema)
