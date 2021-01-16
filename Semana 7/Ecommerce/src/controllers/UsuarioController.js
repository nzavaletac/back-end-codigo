const { Usuario } = require("../config/Sequelize");

const registrarUsuario = async (req, res) => {
  try {
    // se construye el usuario pero NO se manda a la bd
    let nuevoUsuario = Usuario.build(req.body);
    nuevoUsuario.setSaltAndHash(req.body.password);
    // aqui se manda a la bd
    await nuevoUsuario.save();
    let token = nuevoUsuario.generarJWT();
    console.log(nuevoUsuario.usuarioSalt);
    return res.status(201).json({
      ok: true,
      content: token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al crear el usuario",
    });
  }
};

const login = async (req, res) => {
  let usuario = await Usuario.findOne({
    where: {
      usuarioCorreo: req.body.correo,
    },
  });
  if (usuario) {
    let resultado = usuario.validarPassword(req.body.password);
    console.log(resultado);
    return res.json({
      ok: true,
      content: usuario,
    });
  } else {
    return res.status(400).json({
      ok: false,
      content: null,
      message: "Usuario o contraseña incorrectos",
    });
  }
};

module.exports = {
  registrarUsuario,
  login,
};
