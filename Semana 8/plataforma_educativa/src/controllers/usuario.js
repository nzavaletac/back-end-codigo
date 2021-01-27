const { Usuario } = require("../config/mongoose");

const crearUsuario = async (req, res) => {
  try {
    // esto no crea el usuario en la base de datos, solamente construye su objeto con todos sus campos
    let objUsuario = new Usuario(req.body);
    await objUsuario.encriptarPassword(req.body.password);
    // luego que ya tengo todos mis campos seteados correctamente, tengo que ahora guardar en la bd
    let usuarioCreado = await objUsuario.save();
    let token = usuarioCreado.generarJWT();
    return res.status(201).json({
      ok: true,
      content: token,
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
const login= async (req, res)=>{
  let {correo, password} = req.body;
  // https://mongoosejs.com/docs/queries.html
  let usuarioEncontrado = await Usuario.findOne({
    usuario_email:correo
  });
  if(usuarioEncontrado === null){
    return res.status(404).json({
      ok:false,
      content:null,
      message:'Correo o contraseña incorrectos'
    })
  }
  let validacion = await usuarioEncontrado.validarPassword(password);
  if (validacion){
    let token = usuarioEncontrado.generarJWT();
    return res.status(200).json({
      ok:true,
      content:token,
      message:null
    })
  }else{
    return res.status(404).json({
      ok:false,
      content:null,
      message:'Correo o contraseña incorrectos'
    })
  }
};

const inscribirUsuarioCurso = (req, res)=>{
  /*
  1. usar JWT para ver que usuario esta queriendo acceder a que curso
  2. mediante la url indicar el id del curso 
  3. ver si el usuario ya esta inscrito en el curso y si lo esta indicar que ya no se puede enrolar en el curso
  4. si no esta inscrito enrolarlo en el curso y responder que se registro exitosamente
  */
  return res.send('ok');

}
const mostrarCursosUsuario = (req, res)=>{

}

module.exports = {
    crearUsuario,
    login,
    inscribirUsuarioCurso,
    mostrarCursosUsuario
}
