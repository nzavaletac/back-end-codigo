const { Schema } = require("mongoose");
const direccionSchema = require("./direccion");
const telefonoSchema = require("./telefono");

const usuarioSchema = new Schema({
  // usuario_nombre: String // lo unico que haria seria crear la columna y decirle que va a albergar tipos STRING
  usuario_nombre: {
    type: String,
    required: true,
  },
  usuario_apellido: {
    type: String,
    required: true,
  },
  usuario_email: {
    type: String,
    required: true,
    unique: true,
  },
  usuario_direcciones: [direccionSchema],
  usuario_telefonos: [telefonoSchema],
});

module.exports = usuarioSchema;