const jwt = require('jsonwebtoken')
const config = require('../../../config/keys')
const { expressjwt: expressJwt } = require('express-jwt')
const compose = require('composable-middleware')
const User = require('../User/user.model')
const validateJwt = expressJwt({
  secret: config.secretOrKey,
  algorithms: ['HS256']
})


function isAuthenticated () {
  return compose()
    .use((request, response, next) => {
      validateJwt(request, response, next)
      if (
        request.query &&
        Object.prototype.hasOwnProperty.call(request.query, 'access_token')
      ) {
        request.headers.authorization = request.query.access_token
      }
    })
    .use(async (request, response, next) => {
      const user = await User.findById(request.auth.id)
      if (!user) return response.sendStatus(401)

      request.user = user
      next()
    })
}

function hasRole (roleRequired) {
  if (!roleRequired) throw new Error('Requiere un role')

  return compose()
    .use(isAuthenticated())

    .use((request, response, next) => {
      if (
        config.userRoles.indexOf(request.user.role) >=
        config.userRoles.indexOf(roleRequired)
      ) {
        next()
      } else {
        response.sendStatus(403)
      }
    })
}

function signToken (payload) {
  return jwt.sign(payload, config.secretOrKey,{ expiresIn : 312321 });
}

function setTokenCookie (request, response) {
  if (!request.user) {
    return response.json(404, { message: 'Algo salio mal, intente de nuevo' })
  }
  const token = signToken(request.user._id)
  response.cookie('token', JSON.stringify(token))
  response.redirect('/')
  return response.status(200)
}

exports.isAuthenticated = isAuthenticated
exports.hasRole = hasRole
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie
