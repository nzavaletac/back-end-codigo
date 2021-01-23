const { Router } = require("express");
const usuario_controller = require("../controllers/usuario");
const usuario_router = Router();

usuario_router.post("/registro",usuario_controller.crearUsuario);

module.exports = usuario_router;