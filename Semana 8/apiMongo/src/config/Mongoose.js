const usuarioSchema = require("../models/usuario");
const { model } = require("mongoose");

const Usuario = model("usuario", usuarioSchema);

module.exports = {
  Usuario,
};
