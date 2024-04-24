const controller = require('./carrito.controller');
const express = require('express');
const router = express.Router();
const auth = require('../Auth/auth.service');


router.get('/:id', auth.hasRole('user'), controller.obtenerCarritoId);
router.post('/', auth.hasRole("user"),controller.updateCarrito);

module.exports = router;