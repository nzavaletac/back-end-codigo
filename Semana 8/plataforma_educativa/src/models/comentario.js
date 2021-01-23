const { Schema } = require("mongoose");

const comentarioSchema = new Schema(
  {
    // * que el comentario no exceda los 100 caracteres
    // * validar que el usuarioId y cursoId no tengan espacios ni iniciales ni finales
    // * que todos los campos sean requeridos
    comentario: {
      type: String,
      maxlength: 100,
      required: true,
    },
    usuario: {
      type: String,
      required: true,
      trim: true,
    },
    curso: {
      type: String,
      required: true,
      trim: true,
    },
  }
);

module.exports = comentarioSchema;