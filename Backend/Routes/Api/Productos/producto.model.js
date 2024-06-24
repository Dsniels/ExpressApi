const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductScheme = new Schema({
  name: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  marca: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    require: false,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

module.exports = Producto = mongoose.model("Producto", ProductScheme);
