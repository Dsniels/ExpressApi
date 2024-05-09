const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./user.model')
const keys = require('../../../config/keys')
const paginacion = require('../Specificaciones/Paginacion')

exports.registerUser = (request, response) => {
  // Form Validation
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (user) {
        next()
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

              .then((user) => response.json(user))
              .catch((error) => console.log(error))
          })
        })
      }
    })
    .catch((err) => console.log(err))
  next()
  return null
}

exports.loginUser = (request, response) => {
  const email = request.body.email
  const password = request.body.password

  User.findOne({ email }).then((user) => {
    if (!user) {
      next()
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
            if (err) throw new Error('Error al general el token')
            response.json({
              success: true,
              user_token: token
            })
          }
        )
      } else {
        next()
        return response
          .status(400)
          .json({ passwordincorrect: 'Contraseña incorrecta' })
      }
    })
  })
  next()
  return null
}

exports.show = async function (req, response) {
  const user = await User.findById(req.user._id).exec()
  if (!user) {
    next()
    return response.send(404)
  }
  next()
  return response.json(user)
}

exports.showUsers = async (request, response) => {
  const query = request.query
  const exclude = ['sort', 'page', 'limit', 'pageSize']
  const queryObj = { ...query }
  exclude.forEach((element) => {
    delete queryObj[element]
  })
  const users = await paginacion(
    User.find(queryObj).sort(query.sort),
    request.query
  )
  next()
  if (!users) return response.status(404).json({ message: 'No hay usuarios' })

  return response.json(users)
}

exports.updateUser = async (request, response) => {
  const user = await User.findByIdAndUpdate(request.user._id, request.body)
  next()
  return response.json(user)
}
