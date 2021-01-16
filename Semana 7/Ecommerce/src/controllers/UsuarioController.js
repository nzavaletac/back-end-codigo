const { Usuario, Imagen } = require("../config/Sequelize");

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
    // Si el resultado es true, devolver el JWT y si es false devolver en content:null y message:"Usuario o contraseña incorrectos"
    if (resultado) {
      return res.json({
        ok: true,
        content: usuario.generarJWT(),
      });
    }
  }
  return res.status(400).json({
    ok: false,
    content: null,
    message: "Usuario o contraseña incorrectos",
  });
};

const devolverUsuarioPorToken = (req, res) => {
  console.log(req.usuario);
  let { usuarioId } = req.usuario;
  // EJERCICIO 1: solamente quiero ver el usuarioId, usuarioFechaNacimiento, usuarioNombre, usuarioCorreo, usuarioDireccion, imagenId y usuarioTelefono
  // obviar el usuarioHash, usuarioSalt, usuarioTipo
  // EJERCICIO 2: Devolver la imagenURL de la imagen del usuario
  Usuario.findOne({
    // Solucion Ejercicio 1
    attributes: {
      exclude: ["usuarioHash", "usuarioSalt", "usuarioTipo", "imagen_id"],
    },
    // attributes : ['usuarioId', 'usuarioFechaNacimiento', 'usuarioNombre', 'usuarioCorreo', 'usuarioDireccion', 'imagen_id', 'usuarioTelefono'],
    // Solucion Ejercicio 2
    include: {
      model: Imagen,
      attributes: ["imagenId"],
    },
    where: {
      usuarioId,
    },
  }).then((usuarioEncontrado) => {
    usuarioEncontrado.imagene.dataValues.imagenId = "/devolverImagen/"+usuarioEncontrado.imagene.imagenId;
    return res.json({
      ok: true,
      content: usuarioEncontrado,
      url: req.originalUrl,
      message: null,
    });
  });
};

module.exports = {
  registrarUsuario,
  login,
  devolverUsuarioPorToken,
};
