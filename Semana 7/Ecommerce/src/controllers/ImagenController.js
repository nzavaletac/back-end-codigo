const { Imagen } = require("../config/Sequelize");
// ambas librerias vienen instaladas nativamente con nodejs y por ende solo trabajan en entorno nodejs
// fs => libreria para el manejo de archivos dentro del proyecto, sirve para insertar, editar o eliminar archivos desde un js
// https://nodejs.org/api/fs.html
const fs = require("fs");
// path => sirve para devolver archivos del servidor
// https://nodejs.org/api/path.html
const path = require("path");

const subirImagen = async (req, res) => {
  //   console.log(req.files.imagen); // maneja todo el tratamiento de archivos mandados por el front
  let { imagen } = req.files;
  //   console.log(imagen);
  if (imagen) {
    let ruta = imagen.path; // ruta del archivo
    // separar la ruta y solamente quedarme con el nombre del archivo
    let nombreArchivo = ruta.split("\\")[2];
    let imagenCreada = await Imagen.create({
      imagenURL: nombreArchivo,
    });
    return res.json({
      ok: true,
      content: imagenCreada,
      message: "Se subio la imagen correctamente al servidor",
    });
  } else {
    let llave = Object.keys(req.files)[0];
    console.log(llave);
    return res.status(404).json({
      ok: false,
      message: "Falta la imagen a subir",
      content: null,
    });
  }
};

module.exports = {
  subirImagen,
};
