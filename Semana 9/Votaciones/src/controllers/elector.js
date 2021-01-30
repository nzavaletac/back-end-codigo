const { Elector } = require("../config/sequelize");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const { generarToken } = require("../utils/validador");

const clienteCorreo = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // secure va a ser true cuando el puerto sea el 465
  auth: {
    user: "testappseduardo@gmail.com",
    pass: "Pruebas2020",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const crearElector = async (req, res) => {
  /**
   * {
   *  elector_dni:73500746,
   *  elector_email:'ederiveroman@gmail.com'
   *  elector_tipo: 1
   * }
   */
  try {
    const { elector_dni, elector_email, elector_tipo } = req.body;
    let respuesta = await fetch(`https://apiperu.dev/api/dni/${elector_dni}`, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer 6287da8da77342f7e4aab59b670dbe153f0e803c2553e7a7dcbcc7d2510ba793",
      },
    });
    const informacion = await respuesta.json();
    const salt = bcrypt.genSaltSync(10);

    await Elector.create({
      elector_dni,
      elector_email,
      elector_tipo,
      elector_nombre: informacion.data.nombres,
      elector_apellido:
        informacion.data.apellido_paterno +
        " " +
        informacion.data.apellido_materno,
      elector_hash: salt,
    });
    // envio de correo
    let respuestaCorreo = await clienteCorreo.sendMail({
      to: elector_email,
      subject: "Activa tu cuenta de las votaciones! ✅💯",
      text: `Por favor haga click en el siguiente enlace para activar su cuenta: ${req.get(
        "host"
      )}/activarCuenta?id=askdjaksdj`,
      html: `Hola <b>${
        informacion.data.nombres
      } por favor has click en el siguiente enlace para que puedas realizar la votacion.</b>

      ${req.get("host")}/activarCuenta?id=${salt}
      `,
    });
    // fin envio de correo

    return res.json({
      ok: true,
      content: respuestaCorreo,
      message:
        "Se envio el correo al elector, verifique su bandeja de entrada o spam",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      ok: false,
      content: null,
      message: "Hubo un error al crear el elector",
    });
  }
};

const activarElector = async (req, res) => {
  console.log(req.query);
  const { id } = req.query;
  const elector = await Elector.findOne({
    where: {
      elector_hash: id,
    },
  });
  console.log(elector);
  // https://handlebarsjs.com/guide/#what-is-handlebars
  if (elector) {
    // * si el elector ya esta habilitado entonces mostrar otro handlebars en el cual indique el link ya caduco!
    if (elector.elector_habilitado) {
      return res.render("error");
    }
    elector.elector_habilitado = true;
    elector.save();
    return res.render("inicio", {
      nombre: elector.elector_nombre,
      apellido: elector.elector_apellido,
    });
  } else {
    return res.render("no_encontrado");
  }
};

const iniciarSesion = async (req, res) => {
  // hacer la busqueda del elector segun su CORREO y DNI
  let { dni, email } = req.body;
  let elector = await Elector.findOne({
    where: {
      elector_dni: dni,
      elector_email: email,
      elector_habilitado: true,
    },
  });
  if (elector) {
    const token = generarToken({dni:elector.elector_dni});
    return res.json({
      ok: true,
      content: token,
      message: null
    });
  } else {
    return res.status(401).json({
      ok: false,
      content: null,
      message: "Elector no registrado o no habilitado revise su correo",
    });
  }
};
module.exports = {
  crearElector,
  activarElector,
  iniciarSesion,
};
