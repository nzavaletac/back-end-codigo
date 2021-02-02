const {Router}= require("express");
const administrador_controller = require("../controllers/administrador");
const {wachiman, validarAdmin}= require("../utils/validador");

const administrador_router = Router();

administrador_router.get("/presidenciales",wachiman, validarAdmin, administrador_controller.resultadosPresidenciales);
administrador_router.get("/congresales", wachiman, validarAdmin, administrador_controller.resultadosCongresalesPaginados);
module.exports = administrador_router;