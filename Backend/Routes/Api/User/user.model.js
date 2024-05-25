const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: false 
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: '',
    required: false
  },
  googleId : {
    type : String
  }
})

module.exports = User = mongoose.model('User', UserSchema)
