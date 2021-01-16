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
const login = (req, res)=>{}

module.exports = {
  registrarUsuario,
};
