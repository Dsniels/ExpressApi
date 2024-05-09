const controller = require('./orden.controller')
const express = require('express')
const router = express.Router()
const auth = require('../Auth/auth.service')

router.get('/', auth.hasRole('user'), controller.mostrarOrdenes)
router.get('/:id', auth.hasRole('user'), controller.mostrarOrdenPorId)
router.put('/actualizar/:id', auth.hasRole('user'), controller.updateOrden)
router.delete('/eliminar/:id', auth.hasRole('user'), controller.eliminarOrden)
router.post('/crearorden', auth.hasRole('user'), controller.crearOrden)

module.exports = router
