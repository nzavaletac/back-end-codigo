const {
  subirArchivo,
  eliminarArchivoFirebase,
} = require("../utils/manejoArchivoFirebase");
const {Usuario, Curso} = require("../config/mongoose");

const subirImagen = async (req, res) => {
  // si usamos el multer con varios archivos osea any tendremos q llamar a la propiedad files y ya no a file
  try {
    let {modelo, id} = req.query;
    if (modelo !== "usuario" && modelo !== "curso") {
      return res.status(400).json({
        ok: false,
        message: "Modelo no definido",
        conten: null,
      });
    }
    let resultado = await subirArchivo(req.file);
    // luego de subir la imagen a firebase tendria que actualizar el usuario o el curso
    // capturamos el id
    // 127.0.0.1:5000/subirImagen?modelo=curso&id=1231k238912908as

    // 127.0.0.1:5000/subirImagen?modelo=usuario&id=1231k238912908as

    if (modelo === "usuario") {
      let usuario = await Usuario.findByIdAndUpdate(
        id,
        {"usuario_imagen.imagen_url": resultado[0]},
        {new: true}
      );
      return res.status(201).json({
        ok: true,
        message: "Se actualizo la imagen del usuario",
        content: usuario,
      });
    } else if (modelo === "curso") {
      let curso = await Curso.findById(id);
      curso.curso_imagenes.push({
        imagen_url: resultado[0],
      });
      // si nosotros luego que buscar un registro en la bd queremos guardar alguna modificacion esa instancia trae un metodo save() que va a hacer la sobreescritura de lo que le hemos modificado
      // es necesario usar el await para esperar el resultado ya que es una promesa
      // https://mongoosejs.com/docs/documents.html#updating-using-save
      await curso.save();
      return res.status(201).json({
        ok: true,
        message: "Se actualizo las imagenes del curso",
        content: curso,
      });
    }
    return res.status(401).json({
      ok: false,
      content: null,
      message: "Faltan campos",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al subir el archivo",
    });
  }
};

const eliminarImagenUsuario = async (req, res) => {
  // al eliminar la imagen del usuario me mandara solamente su id y tendremos que buscar en la bd el nombre de la imagen
  // ruta => 127.0.0.1:5000/eliminarImgUsu/asd5as1d51ad
  // ruta => 127.0.0.1:5000/eliminarImgUsu/:id
  // portrait.jpg_1611627176980
  let {id} = req.params;
  let usuarioEncontrado = await Usuario.findById(id);
  let url = usuarioEncontrado.usuario_imagen.imagen_url;
  // let subimagen =url.split('.com/')[2];
  // let imagen = subimagen.split('?')[0];
  // console.log(imagen);
  usuarioEncontrado.usuario_imagen.imagen_url = "";
  await usuarioEncontrado.save();
  eliminarArchivoFirebase(url);
  return res.json({
    ok: true,
    content: usuarioEncontrado,
    message: "Se elimino la imagen del usuario exitosamente",
  });
};

const eliminarImagenCurso = async (req, res) => {
  // el id del curso y la posicion de la imagen
  // 127.0.0.1:5000/eliminarImgCurso/:id/:posicion
  let {id, posicion} = req.params;
  let cursoEncontrado = await Curso.findById(id);
  let imagen = cursoEncontrado.curso_imagenes[posicion];
  // let subimagen =imagen.imagen_url.split('.com/')[2];
  // let nombreImagen = subimagen.split('?')[0];
  // console.log(imagen.imagen_url);
  let resultadoFirebase = await eliminarArchivoFirebase(imagen.imagen_url);
  cursoEncontrado.curso_imagenes.splice(posicion, 1);
  cursoEncontrado.save();
  if (resultadoFirebase) {
    return res.json({
      ok: true,
      content: null,
      message: "Imagen eliminada exitosamente",
    });
  }
  return res.json({
    ok: true,
    content: null,
    message:
      "Imagen eliminada exitosamente de la bd pero no se encontro en el storage",
  });
};

module.exports = {
  subirImagen,
  eliminarImagenUsuario,
  eliminarImagenCurso,
};
