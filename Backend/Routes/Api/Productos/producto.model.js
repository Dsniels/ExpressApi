const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductScheme = new Schema({
  name: {
    type: String,
  },
  categoria: {
    type: String,
  },
  precio: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  marca: {
    type: String,
  },
  imagen: {
    type: String,
    default: ''
  },
  description : {
    type :String,
    default:''
  }
})

module.exports = Producto = mongoose.model('Producto', ProductScheme)
