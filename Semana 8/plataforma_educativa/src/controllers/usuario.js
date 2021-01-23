const { Usuario } = require("../config/mongoose");

const crearUsuario = async (req, res) => {
  try {
    // esto no crea el usuario en la base de datos, solamente construye su objeto con todos sus campos
    let objUsuario = new Usuario(req.body);
    await objUsuario.encriptarPassword(req.body.password);
    // luego que ya tengo todos mis campos seteados correctamente, tengo que ahora guardar en la bd
    let usuarioCreado = await objUsuario.save();
    return res.status(201).json({
      ok: true,
      content: usuarioCreado,
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

module.exports = {
    crearUsuario
}
