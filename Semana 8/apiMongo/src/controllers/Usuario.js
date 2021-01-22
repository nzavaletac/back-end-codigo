const { Usuario } = require("../config/Mongoose");

const crearUsuario = async (req, res) => {
  try {
    let usuario = await Usuario.create(req.body);
    return res.status(201).json({
      ok: true,
      content: usuario,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al crear el usuario",
    });
  }
};

const listarUsuario = (req, res) => {};

const editarUsuario = (req, res) => {};

const eliminarUsuario = (req, res) => {};
// Controladores con logica

const editarDireccionesDeUsuario = (req, res) => {};

//...

module.exports = {
  crearUsuario,
  listarUsuario,
  editarUsuario,
  eliminarUsuario,
};
