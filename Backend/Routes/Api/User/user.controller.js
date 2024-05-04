const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./user.model')
const keys = require('../../../config/keys')
const paginacion = require('../Specificaciones/Paginacion')

function handleError (res, err) {
  return res.send(500, err)
}

exports.registerUser = (request, response) => {
  // Form Validation
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (user) {
        return response.status(400).json({ email: 'El email ya existe' })
      } else {
        const newUser = new User(request.body)

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then((user) => response.json())
              .catch((error) => console.log(err))
          })
        })
      }
    })
    .catch((err) => console.log(err))
}

exports.loginUser = (request, response) => {
  const email = request.body.email
  const password = request.body.password

  User.findOne({ email }).then((user) => {
    if (!user) {
      return response
        .status(404)
        .json({ emailnotfound: 'Email no encontrado' })
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Crear JWT
        const payload = {
          id: user.id,
          name: user.name
        }

        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3123212
          },
          (err, token) => {
            response.json({
              success: true,
              token
            })
          }
        )
      } else {
        return response
          .status(400)
          .json({ passwordincorrect: 'Contraseña incorrecta' })
      }
    })
  })
}

exports.show = async function (req, response) {
  const user = await User.findById(req.user._id).exec()
  if (!user) {
    return response.send(404)
  }
  return response.json(user)
}

exports.showUsers = async (request, response) => {
  const users = await paginacion(User.find(), request.query)

  if (!users) return response.status(404).json({ message: 'No hay usuarios' })

  return response.json(users)
}

exports.updateUser = async (request, response) => {
  const user = await User.findByIdAndUpdate(request.user._id, request.body)

  return response.json(user)
}
