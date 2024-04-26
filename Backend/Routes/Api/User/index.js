const controller = require('./user.controller');
const express = require('express');
const auth = require('../Auth/auth.service');
const router = express.Router();

router.get('/', auth.hasRole("user"), controller.show);

router.get('/all', auth.hasRole("manager"), controller.showUsers);

router.post('/registrarse', controller.registerUser);

router.post("/login", controller.loginUser);

router.put('/actualizar', auth.hasRole('user') ,controller.updateUser);

module.exports = router;


