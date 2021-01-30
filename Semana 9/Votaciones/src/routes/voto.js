const { Router } = require("express");
const voto_controller = require("../controllers/voto");
const { wachiman } = require("../utils/validador");
const voto_router = Router();

voto_router.post("/voto",wachiman, voto_controller.crearVoto);

module.exports = voto_router;
