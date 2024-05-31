const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ordenItem = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  marca: {
    type: String,
  },
  quantity: {
    type: String,
    require: true
  },
  unit_amount:{
    type:Object
  }
})

const OrdenSchema = new Schema({
  Total: {
    type: Number,
    required: true
  },
  id : {
    type : String
  },
  items: [ordenItem],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  direccion :{
    type: Schema.ObjectId,
    ref : 'Direccion'
  }
})
module.exports = Orden = mongoose.model('Orden', OrdenSchema)
