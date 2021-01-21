const usuarioSchema = require("../models/usuario");
const cursoSchema = require("../models/curso");
const {model} = require("mongoose");

const Usuario = model('usuario',usuarioSchema);
const Curso = model('curso', cursoSchema);
module.exports = {
    Usuario,
    Curso
}