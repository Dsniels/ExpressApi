const controller = require('./producto.controller');
const express = require('express');
const router = express.Router();

router.get("/:id", controller.getProduct);
router.get("/", controller.getProducts);
router.post('/agregar', controller.registrarProducto);
router.put('/actualizar/:id', controller.updateProducto);
router.delete('/eliminar', controller.deleteProducto);

module.exports = router;