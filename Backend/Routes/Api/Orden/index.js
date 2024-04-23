const controller = require('./orden.controller');
const express = require('express');
const router = express.Router();


router.get('/', controller.mostrarOrdenes);
