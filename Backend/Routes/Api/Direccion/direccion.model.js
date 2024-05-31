const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DireccionSchema = new Schema({
  Estado: {
    type: String,
  },
  Ciudad: {
    type: String,
  },
  CodigoPostal: {
    type: Number,
  },
  Colonia: {
    type: String,
  },
  Calle: {
    type: String,
  },
  Pais: {
    type: String,
  },
  User: {
    type: Schema.ObjectId,
    ref: "User",
  },
});

module.exports = Direccion = mongoose.model("Direccion", DireccionSchema);
