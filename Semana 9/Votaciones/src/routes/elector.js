const {Router} = require("express");
const elector_controller = require("../controllers/elector");
const elector_router = Router();

elector_router.post("/registrar", elector_controller.crearElector);

module.exports = elector_router;