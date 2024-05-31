const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordenItem = new Schema({
  name: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  marca: {
    type: String,
    required: true,
  },
  cantidad: {
    type: Number,
    require: true,
  },
});

const OrdenSchema = new Schema({
  Total: {
    type: Number,
    required: true,
  },
  statusPago: {
    type: String,
    required: true,
    default: "No pagado",
  },

  items: [ordenItem],
  user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  direccion: {
    type: Schema.ObjectId,
    ref: "Direccion",
  },
});
module.exports = Orden = mongoose.model("Orden", OrdenSchema);
