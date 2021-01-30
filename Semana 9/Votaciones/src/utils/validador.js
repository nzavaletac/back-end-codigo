const jwt = require("jsonwebtoken");
const secret = process.env.JWT || "votaciones";
const { Elector } = require("../config/sequelize");
const verificarToken = (token) => {
  try {
    const payload = jwt.verify(token, secret, { algorithm: "RS256" });
    return payload;
  } catch (error) {
    return error.message;
  }
};
const wachiman = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]; // Bearer asjkda.aksjdaks.asdjkasd
    const respuesta = verificarToken(token);
    if (typeof respuesta === "object") {
      req.user = respuesta;
      next();
    } else {
      res.status(401).json({
        ok: false,
        message: "No estas autorizado para realizar esta solicitud",
      });
    }
  } else {
    res.status(401).json({
      ok: false,
      message: "Necesitas estar autenticado para realizar esta peticion",
    });
  }
};
const renovarToken = async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const respuesta = verificarToken(token);
    // console.log(respuesta);
    if (typeof respuesta === "object") {
      return res.json({
        ok: true,
        message: "la token aun es valida y no necesita renovarse",
      });
    } else if (typeof respuesta === "string") {
      if (respuesta === "jwt expired") {
        // mi token era valida pero ya expiró!
        // el metodo decode sirve para decodificar la token si pasamos su parametro {complete: true} nos dará las tres partes legibles excepto por la contraseña que seguira estando encriptada.
        const decoded = jwt.decode(token);
        // console.log(decoded.elector_dni);
        const nuevaToken = generarToken({ dni: decoded.elector_dni });
        return res.json({
          ok: true,
          content: nuevaToken,
        });
      } else {
        // la contraseña es incorrecta | la token es invalida
        return res.json({
          ok: false,
          message: "token incorrecta",
        });
      }
    }
  } else {
    res.status(401).json({
      ok: false,
      message: "Se necesita una token",
    });
  }
};

const generarToken = ({ dni }) => {
  // destructuracion de todo mi elector en mi zona de parametro
  const payload = {
    elector_dni: dni,
  };
  const token = jwt.sign(
    payload,
    secret,
    { expiresIn: 60 },
    { algorithm: "RS256" }
  );
  return token;
};

const validarAdmin = async (req, res, next) => {
  const electorEncontrado = await Elector.findByPk(req.user.elector_dni);
  if(electorEncontrado.elector_tipo === 1){
    next();
  }else{
    return res.json({
      ok: false,
      content: null,
      message: 'Usuario no cuenta con los privilegios suficientes para esta solicitud'
    })
  }
};

module.exports = {
  generarToken,
  verificarToken,
  renovarToken,
  wachiman,
  validarAdmin,
};
