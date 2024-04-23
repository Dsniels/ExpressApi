const controller = require('./orden.controller');
const express = require('express');
const router = express.Router();


router.get('/', controller.mostrarOrdenes);
router.get('/:id', controller.mostrarOrdenPorId);
router.put('/actualizar/:id', controller.updateOrden);
router.delete('/eliminar/:id', controller.eliminarOrden);
