const { Curso } = require("../config/mongoose");

const crearCurso = async (req, res) => {
  try {
    let objCurso = new Curso(req.body);
    // aquí ira la logica de agrega la imagen
    let nuevoCurso = await objCurso.save();
    return res.status(201).json({
      ok: true,
      content: nuevoCurso,
      message: "Curso creado exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      content: error,
      message: "Error al crear el curso",
    });
  }
};

const listarCursos = (req, res) => {
  Curso.find().then((cursos) =>
    res.json({
      ok: true,
      content: cursos,
      message: null,
    })
  );
};

const listarCursosPorNombre = async (req, res) => {
  // devolver solamente los cursos que coincidan con el nombre y ademas que esten activos
  // Curso.find().where({...})
  let { nombre } = req.params;
  // * PRIMERA FORMA
  /*
    let resultado = await Curso.find({
        curso_nombre : {$regex: '.*'+nombre+'.*'},
        curso_publicado: true
    })
    */
  // * SEGUNDA FORMA
  /*
    let resultado = await Curso.where({
        curso_nombre : {$regex: '.*'+nombre+'.*'},
        curso_publicado: true
    })
    */

  // * TERCERA FORMA
  let resultado = await Curso
    .where("curso_nombre")
    .equals({ $regex: ".*" + nombre + ".*" })
    .where("curso_publicado")
    .equals(true);
  // https://mongoosejs.com/docs/api/query.html#query_Query-equals
  return res.json({
    ok: true,
    content: resultado,
    message: null,
  });
};

module.exports = {
  crearCurso,
  listarCursos,
  listarCursosPorNombre,
};
