const { Imagen } = require("../config/Sequelize");
// ambas librerias vienen instaladas nativamente con nodejs y por ende solo trabajan en entorno nodejs
// fs => libreria para el manejo de archivos dentro del proyecto, sirve para insertar, editar o eliminar archivos desde un js
// https://nodejs.org/api/fs.html
const fs = require("fs");
// path => sirve para devolver archivos del servidor
// https://nodejs.org/api/path.html
const path = require("path");

const subirImagen = async (req, res) => {
  try {
    //   console.log(req.files.imagen); // maneja todo el tratamiento de archivos mandados por el front
    let { imagen } = req.files;
    // permitir SOLAMENTE la subida de imagenes
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String/includes
    // if (imagen && imagen.type.split('/')[0]==="image") {
    if (imagen && imagen.type.includes('image')) {
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
      if (llave) {
          let ruta =req.files[llave].path;
          // eliminar ese archivo del servidor
          fs.unlink(ruta,(errorEliminacion)=>{
              console.log(errorEliminacion);
          });
      }
      return res.status(404).json({
        ok: false,
        message: "Falta la imagen a subir",
        content: null,
      });
    }
  } catch (error) {
      return res.status(500).json({
          ok: false,
          content: error,
          message: 'Hubo un error la registrar la imagen'
      })
  }
};

const devolverImagenPorId = async(req, res)=>{
    let {id} = req.params;
    let imagen = await Imagen.findByPk(id);
    if(imagen){
        // console.log(imagen);
        let ruta = `src/multimedia/${imagen.imagenURL}`;
        let rutaDefault = `src/multimedia/default.jpg`;
        // verifica si existe ese archivo en el proyecto, y retorna True si existe y False si no existe
        console.log(fs.existsSync(ruta));
        if(fs.existsSync(ruta)){
            // resolve sirve para mostrar el archivo
            // sendFile => sirve para mandar al cliente (front) un archivo y solamente un archivo, sin campos adicionales
            return res.sendFile(path.resolve(ruta));
        }else{
            return res.sendFile(path.resolve(rutaDefault));
        }
    }else{
        return res.status(404).json({
            ok: false,
            content: null,
            message: 'No existe esa imagen'
        })
    }
}

module.exports = {
  subirImagen,
  devolverImagenPorId
};
