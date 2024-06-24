const controller = require('./orden.controller')
const express = require('express')
const router = express.Router()
const auth = require('../Auth/auth.service')

router.post('/:orderID/capture',controller.captureOrden)
router.get('/', auth.hasRole('user'), controller.mostrarOrdenes)
router.get('/:id', auth.hasRole('user'), controller.mostrarOrdenPorId)
router.put('/actualizar/:id', auth.hasRole('user'), controller.updateOrden)
router.get('/ordenesUsuario', auth.hasRole('user'), controller.userOrdenes);
router.delete('/eliminar/:id', auth.hasRole('user'), controller.eliminarOrden)
router.post('/crearorden', auth.hasRole('user'), controller.crearOrden)

module.exports = router
