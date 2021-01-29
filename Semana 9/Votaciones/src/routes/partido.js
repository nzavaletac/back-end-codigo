const {Router} =require("express");
const partido_controller = require("../controllers/partido");
const partido_router = Router();

partido_router.post("/partido", partido_controller.crearPartido);

module.exports = partido_router;