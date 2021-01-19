const jwt = require("jsonwebtoken");

const verificarToken = (token) => {
  try {
    // verificar si la token recibida cumple ciertas condiciones como: ver si aun tiene tiempo de vida, si la contraseña es correcta y si tiene un formato correcto
    // NOTA: la contraseña tiene que ser EXACTAMENTE LA MISMA con la cual la generamos
    let password = process.env.JWT_SECRET || "codigo4";
    let resultado = jwt.verify(token, password, { algorithm: "RS256" });
    return resultado;
  } catch (error) {
    console.log(error);
    return null;
  }
};
// middleware
// es un observador que si todo lo que le pasemos cumple, pasara al siguiente controlador, caso contrario, ahi terminara la consulta, un vigilante, un wachiman
// el next sirve para dar paso al siguiente controlador si es que todo fue cumplido exitosamente
const wachiman = (req, res, next) => {
  // console.log(req.headers);
  if (req.headers.authorization) {
    // Bearer asdasd.asdasdasd.asdasdasd
    let token = req.headers.authorization.split(" ")[1]; //['Bearer', 'asdads.asdasd.asdasd']
    let respuesta = verificarToken(token); // me devuelve el payload
    // console.log(respuesta);
    if (respuesta) {
      // SEGUNDO METODO EJERCICIO 1
      req.usuario = respuesta;
      next();
    } else {
      return res.status(401).json({
        ok: false,
        content: "No estas autorizado para realizar esta solicitud",
      });
    }
  } else {
    return res.status(401).json({
      ok: false,
      message: "Necesitas estar autenticado para realizar esta peticion",
    });
  }
};
const validacionMultiple = (tipo, authorization, res, next) => {
  // tipo =1 => validar admin
  // tipo = 2 => validar admin y vendedor
  if (authorization) {
    let token = authorization.split(" ")[1];
    let respuesta = verificarToken(token);
    switch (tipo) {
      case 1:
        if (respuesta && respuesta.usuarioTipo === 1) {
          return next();
        }
      case 2:
        if (
          respuesta &&
          (respuesta.usuarioTipo === 1 || respuesta.usuarioTipo === 2)
        ) {
          return next();
        }
      default:
        break;
    }
    return res.status(401).json({
      ok: false,
      content: "No estas autorizado para realizar esta solicitud",
    });
  } else {
    return res.status(401).json({
      ok: false,
      message: "Necesitas estar autenticado para realizar esta peticion",
    });
  }
};
const validarAdmin = (req, res, next) => {
  return validacionMultiple(1, req.headers.authorization, res, next);

  /*

  // acá hacemos la validacion
  // Primer metodo EJERCICIO 1
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    let respuesta = verificarToken(token);
    console.log(respuesta);
    if (respuesta && respuesta.usuarioTipo === 1) {
      next();
    } else {
      return res.status(401).json({
        ok: false,
        content: "No estas autorizado para realizar esta solicitud",
      });
    }
  } else {
    return res.status(401).json({
      ok: false,
      message: "Necesitas estar autenticado para realizar esta peticion",
    });
  }
  */
};

const validarAdminYVendedor = (req, res, next) => {
  return validacionMultiple(2, req.headers.authorization, res, next);
  /*
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    let respuesta = verificarToken(token);
    if (
      (respuesta && respuesta.usuarioTipo === 1) ||
      respuesta.usuarioTipo === 2
    ) {
      next();
    } else {
      return res.status(401).json({
        ok: false,
        content: "No estas autorizado para realizar esta solicitud",
      });
    }
  } else {
    return res.status(401).json({
      ok: false,
      message: "Necesitas estar autenticado para realizar esta peticion",
    });
  }
  */
};

module.exports = {
  wachiman,
  validarAdmin,
  validarAdminYVendedor,
};
