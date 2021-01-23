const usuarioSchema = require("../models/usuario");
const cursoSchema = require("../models/curso");
const comentarioSchema = require("../models/comentario");

const { model } = require("mongoose");

const Usuario = model("usuario", usuarioSchema);
const Curso = model("curso", cursoSchema);
const ComentarioSchema = model("comentario", comentarioSchema);

module.exports = {
  Usuario,
  Curso,
  ComentarioSchema,
};
