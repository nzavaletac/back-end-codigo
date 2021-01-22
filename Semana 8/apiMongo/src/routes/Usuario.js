const {Router} = require("express");
const usuario_controller = require("../controllers/Usuario");
const usuario_router = Router();

usuario_router.post("/usuario", usuario_controller.crearUsuario);

module.exports = usuario_router;