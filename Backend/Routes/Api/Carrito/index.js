const controller = require('./carrito.controller')
const express = require('express')
const router = express.Router()
const auth = require('../Auth/auth.service')

router.post('/', auth.hasRole('user'), controller.updateCarrito)
router.get('/get', auth.hasRole('user'), controller.obtenerCarritoId)
router.delete('/:id', auth.hasRole('user'), controller.deleteCarrito)
module.exports = router
