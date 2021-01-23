const { subirArchivo } = require("../utils/manejoArchivoFirebase");
const subirImagen = async (req, res) => {
  // si usamos el multer con varios archivos osea any tendremos q llamar a la propiedad files y ya no a file
  try {
    console.log(req.file);
    let resultado = await subirArchivo(req.file);
    return res.json({
      ok: true,
      content: resultado
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
