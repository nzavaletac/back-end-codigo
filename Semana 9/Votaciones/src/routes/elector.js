const {Router} = require("express");
const elector_controller = require("../controllers/elector");
const elector_router = Router();

elector_router.post("/registrar", elector_controller.crearElector);
elector_router.get("/activarCuenta", elector_controller.activarElector);
elector_router.post("/iniciarSesion", elector_controller.iniciarSesion);

module.exports = elector_router;