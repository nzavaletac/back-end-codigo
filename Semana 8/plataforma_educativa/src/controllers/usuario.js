const { Usuario, Curso } = require("../config/mongoose");

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

const inscribirUsuarioCurso = async(req, res)=>{
  /*
  1. usar JWT para ver que usuario esta queriendo acceder a que curso ✔
  2. mediante la url indicar el id del curso ✔
  2.1 Ver si el curso existe ✔
  3. ver si el usuario ya esta inscrito en el curso y si lo esta indicar que ya no se puede enrolar en el curso, se puede realizar en dos formas, la primera es ver dentro del cursoEncontrado sus usuarios, la segunda forma era traer el usuario encontrado segun su id y ver sus cursos
  4. si no esta inscrito enrolarlo en el curso y responder que se registro exitosamente
  */
  let {id_curso} = req.params;
  let {usuario_id} = req.usuario;
  console.log(req.usuario);
  try {
    let cursoEncontrado = await Curso.findById(id_curso);
    let usuarioEncontrado = await Usuario.findById(usuario_id);
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/includes
    // Primera forma paso 3
    // let resultado = cursoEncontrado.usuarios.includes(usuario_id);
    // console.log(cursoEncontrado.usuarios.includes(usuario_id));

    // Segunda Forma paso 3
    let resultado = usuarioEncontrado.cursos.includes(id_curso);
    console.log(usuarioEncontrado.cursos.includes(id_curso));

    if (resultado){ // resultado === true
      return res.status(401).json({
        ok: false,
        content: null,
        message:'Usuario ya se encuentra enrolado en el curso'
      })
    }
    // Paso 4
    console.log(usuarioEncontrado._id.toString());
    cursoEncontrado.usuarios.push(usuarioEncontrado);
    cursoEncontrado.save();

    usuarioEncontrado.cursos.push(cursoEncontrado._id);
    usuarioEncontrado.save();
    return res.status(201).json({
      ok:true,
      content: null,
      message:'Usuario enrolado al curso exitosamente'
    })

  } catch (error) {
    return res.status(401).json({
      ok:false,
      content: error,
      message:'Id de curso incorrecto'
    })    
  }
};

const mostrarCursosUsuario = async(req, res)=>{
  /*
  1. necesitaria el JWT
  2. validar el usuario
  3. iterar los cursos de esos usuario y buscarlo en la coleccion cursos
  4. devolver los cursos con sus curso_nombre, curso_link y curso_imagenes
  */
  let {usuario_id} = req.usuario;
  const usuarioEncontrado = await Usuario.findById(usuario_id);
  const {cursos} = usuarioEncontrado;
  let resultado = [];
  for (const key in cursos) {
    const cursoEncontrado = await Curso.findById(cursos[key],'curso_nombre curso_link curso_imagenes');
    resultado.push(cursoEncontrado);
  }
  res.json({
    ok: true,
    content: resultado
  })
}

module.exports = {
    crearUsuario,
    login,
    inscribirUsuarioCurso,
    mostrarCursosUsuario
}
