const { Router } = require("express");
const { wachiman } = require("../utils/validador");
const usuario_controller = require("../controllers/usuario");
const usuario_router = Router();

usuario_router.post("/registro",usuario_controller.crearUsuario);
usuario_router.post("/login", usuario_controller.login);
usuario_router.post("/matricularUsuario/:id_curso", wachiman, usuario_controller.inscribirUsuarioCurso);


module.exports = usuario_router;