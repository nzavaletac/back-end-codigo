const { Schema } = require("mongoose");

const telefonoSchema = new Schema(
  {
    telefono_tipo: {
      type: String,
      required: true,
      uppercase: true,
      maxlength: 20,
      trim: true, // remueve espacios iniciales y finales antes de registrarlos
    },
    telefono_descripcion: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 10,
    },
  },
  { _id: false }
);
module.exports = telefonoSchema;
