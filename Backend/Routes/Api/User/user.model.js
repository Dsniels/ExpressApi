const mongoose = require("mongoose");
const direccion = require("../Direccion/direccion.model");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: "",
    required: false,
  },
  googleId: {
    type: String,
  },
  token: {
    type: String,
  },
  Direccion: {
    type: Schema.Types.ObjectId,
    ref: "Direccion",
  },
});

module.exports = User = mongoose.model("User", UserSchema);
