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

const listarUsuario = async (req, res) => {
  let usuarios = await Usuario.find({});
  return res.json({
    ok: true,
    content: usuarios,
    message: null,
  });
};

const editarUsuario = async (req, res) => {
  let { id } = req.params;
  let usuarioActualizado = await Usuario.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.json({
    ok: true,
    content: usuarioActualizado,
    message: null,
  });
};

const eliminarUsuario = async (req, res) => {
  let { id } = req.query;
  try {
    let resultado = await Usuario.findByIdAndDelete(id, {});
    // validar que el usuario exista y si no indicar con un stado 404
    // usando operador ternario
    return res.status(resultado ? 200 : 404).json({
      ok: true,
      content: resultado,
      message: resultado
        ? "Usuario eliminado exitosamente"
        : "Usuario no encontrado",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Error al eliminar el usuario",
    });
  }
};
// Controladores con logica

const filterUsuarioPorNombre = async (req, res) => {
  let { nombre } = req.params;
  try {
    // https://docs.mongodb.com/manual/reference/operator/query/
    // https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_regex
    // https://mongoosejs.com/docs/models.html
    let resultado = await Usuario.find({
      usuario_nombre: { $regex: ".*" + nombre + ".*" }, // hacer un like en mongoDb
    });
    return res.json({
      ok: true,
      content: resultado,
      message: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al hacer la busqueda",
    });
  }
};

const buscarPorCorreo = async (req, res) => {
  // se solicita un controlador para buscar por correo EXACTO y que solamente regrese las direcciones de ese correo
  let { email } = req.params;
  try {
    let resultado = await Usuario.findOne(
      { usuario_email: email },
      "usuario_direcciones"
    );
    return res.json({
      ok: true,
      content: resultado,
      message: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al hacer la busqueda",
    });
  }
};

//...

module.exports = {
  crearUsuario,
  listarUsuario,
  editarUsuario,
  eliminarUsuario,
  filterUsuarioPorNombre,
  buscarPorCorreo,
};
