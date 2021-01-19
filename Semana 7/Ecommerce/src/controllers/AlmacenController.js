const { Almacen } = require("../config/Sequelize");

const createAlmacen = (req, res) => {
  // SEGUNDO METODO EJERCICIO 1
  /*
  console.log('yo me imprimo desde el controlador');
  if(req.usuario.usuarioTipo != 1) return res.json({
    ok: false,
    content: "No estas autorizado para realizar esta solicitud",
  })
  */
  // si usamos el build eso no retorna una promesa, eso retorna un objeto tipo Almacen, no retorna una promesa porque no hace la consulta a la bd, el build sirve para construir el tipo de dato mas no lo verifica con los datos en la bd
  let objAlmacen = Almacen.build(req.body);
  // el metodo save va de la mano con el build y solo se ejecutará luego que tengamos una instancia de la clase Almacen creada y este SI retornará una promesa puesto que ya esta haciendo peticion a la base de datos
  objAlmacen
    .save()
    .then((almacenCreado) => {
      return res.status(201).json({
        ok: true,
        content: almacenCreado,
        message: null,
      });
    })
    .catch((error) => {
      return res.json({
        ok: false,
        content: error,
        message: "Hubo un error al crear el almacen",
      });
    });
};

const devolverAlmacenes = async (req, res) => {
  let almacenes = await Almacen.findAll();
  return res.json({
    ok: true,
    content: almacenes,
    message: null,
  });
};

module.exports = {
  createAlmacen,
  devolverAlmacenes,
};
