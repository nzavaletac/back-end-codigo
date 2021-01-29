const { Elector } = require("../config/sequelize");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

const clienteCorreo = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // secure va a ser true cuando el puerto sea el 465
    auth:{
        user: 'testappseduardo@gmail.com',
        pass: 'Pruebas2020'
    }
})

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
    // envio de correo
    let respuestaCorreo = await clienteCorreo.sendMail({
        to:elector_email,
        subject:'Activa tu cuenta de las votaciones! ✅💯',
        text:`Por favor haga click en el siguiente enlace para activar su cuenta: ${req.get('host')}/activarCuenta?id=askdjaksdj`,
        html:`Hola <b>${informacion.data.nombres} por favor has click en el siguiente enlace para que puedas realizar la votacion.</b>

        ${req.get('host')}/activarCuenta?id=${salt}
        `
    })
    // fin envio de correo
    const electorCreado = await Elector.create({
      elector_dni,
      elector_email,
      elector_tipo,
      elector_nombre: informacion.data.nombres,
      elector_apellido: informacion.data.apellido_paterno + " " + informacion.data.apellido_materno,
      elector_hash:salt
    });

    return res.json({
      ok: true,
      content: respuestaCorreo,
      message: 'Se envio el correo al elector, verifique su bandeja de entrada o spam',
    });
  } catch (error) {
    return res.json({
      ok: false,
      content: null,
      message: "Hubo un error al crear el elector",
    });
  }
};

module.exports = {
  crearElector,
};
