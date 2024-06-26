const { hasRole } = require("../Auth/auth.service");
const controller = require("./producto.controller");
const express = require("express");
const router = express.Router();

router.get("/:id", controller.getProduct);
router.get("/", controller.getProducts);
router.post("/agregar", hasRole("manager"), controller.registrarProducto);
router.put("/actualizar/:id", hasRole("manager"), controller.updateProducto);
router.delete("/eliminar/:id", hasRole("manager"), controller.deleteProducto);

module.exports = router;
