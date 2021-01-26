const { subirArchivo } = require("../utils/manejoArchivoFirebase");
const {Usuario} = require("../config/mongoose");

const subirImagen = async (req, res) => {
  // si usamos el multer con varios archivos osea any tendremos q llamar a la propiedad files y ya no a file
  try {
    console.log(req.file);
    let resultado = await subirArchivo(req.file);
    // luego de subir la imagen a firebase tendria que actualizar el usuario o el curso
    // capturamos el id
    // 127.0.0.1:5000/subirImagen?modelo=curso&id=1231k238912908as

    // 127.0.0.1:5000/subirImagen?modelo=usuario&id=1231k238912908as
    let {modelo, id} = req.query;
    if(modelo==='usuario'){
      console.log(resultado);
      let usuario = await Usuario.findByIdAndUpdate(id, {'usuario_imagen.imagen_url':resultado[0]}, {new:true});
      return res.status(201).json({
        ok: true,
        message: 'Se actualizo la imagen del usuario',
        content: usuario
      });
    }else if(modelo==='curso'){

    }
    return res.status(401).json({
      ok: true,
      content: null,
      message:'Faltan campos'
    });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          ok:false,
          content: error,
          message: 'Hubo un error al subir el archivo'
      })
  }
};

module.exports = {
  subirImagen,
};
