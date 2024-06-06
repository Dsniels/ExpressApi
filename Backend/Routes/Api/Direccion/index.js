const express = require('express');
const router = express.Router();
const controller = require('./direccion.controller');
const { hasRole } = require('../Auth/auth.service');


router.put('/actualizarDireccion', hasRole('user'), controller.ActualizarDireccion);
router.get('/', hasRole('user'), controller.getDireccion);
router.get('/user/:id', hasRole('manager'), controller.getUserDireccion);

module.exports = router;