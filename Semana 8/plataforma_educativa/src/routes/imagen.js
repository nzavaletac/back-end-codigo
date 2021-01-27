const {Router} = require("express");
// npm i multer
const Multer = require("multer");
const imagen_controller = require("../controllers/imagen");
const imagen_router = Router();
// * se le da atributos que guarden en la memory storage y tambien se puede limitar su tamaño definido en bytes
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits:{
                //bytes*1024=kilobytes*1024=megabytes
        fileSize: 5*1024*1024
    }

});

imagen_router.post("/subirImagen", multer.single('imagen'),imagen_controller.subirImagen);
imagen_router.delete("/eliminarImgUsu/:id", imagen_controller.eliminarImagenUsuario);
imagen_router.delete("/eliminarImgCurso/:id/:posicion", imagen_controller.eliminarImagenCurso);

module.exports = imagen_router;