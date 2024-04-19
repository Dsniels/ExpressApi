const controller = require('./user.controller');
const express = require('express');
const auth = require('../Auth/auth.service');
const router = express.Router();

router.get('/', auth.hasRole("user"), controller.show);

router.post('/registrarse', controller.registerUser);

router.post("/login", controller.loginUser);

module.exports = router;


