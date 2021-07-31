const {Producto} = require("../config/Sequelize");
const {Op} = require("sequelize"); // Operators de Sequelize
// https://sequelize.org/master/manual/model-querying-basics.html#operators

const crearProducto = async (req, res) => {
  let cuerpo = req.body;
  // toda manipulacion con Sequelieze nos retorna una promesa.
  // la forma mas directa de crear un registro en la bd es mediante el metodo create en el cual se tiene que mandar un JSON con todos los campos requeridos de dicho modelo.
  // 2 formas de trabajar promesas, la primera es usando .then().catch()
  // la segunda forma es usando un palabra llamada await (va a esperar al resultado de esa promesa), lo mas recomendable es usarlo con un try - catch, y obligatoriamente al usar el await en su funcion mas proxima se debe de declara que va a ser una funcion asincrona (async)
  try {
    let nuevoProducto = await Producto.create(cuerpo);
    console.log(nuevoProducto);
    return res.json({
      ok: true,
      content: nuevoProducto,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      ok: false,
      content: error,
    });
  }
};

const listarProductos = (req, res) => {
  // SELECT * FROM T_PRODUCTO
  // Producto.findAll()

  // si yo quiero editar el nombre con el cual esta en la bd dentro de cada atributo le pongo un array PERO el nombre que ahora voy a reemplazar tiene que ser el nombre que esta en la BASE DE DATOS
  // SELECT PROD_NOM AS NOMBRE, PROD_PREC FROM T_PRODUCTO
  // Producto.findAll({
  //     attributes: [['prod_nomb','Nombre'], 'productoPrecio']
  // })
  // SELECT PROD_ID PROD_NOM, PROD_PREC, PROD_REGSAN FROM T_PRODUCTO
  Producto.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  })
    .then((productos) => {
      return res.json({
        ok: true,
        content: productos,
        message: null,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        ok: false,
        content: error,
        message: "Hubo un error al devolver los productos",
      });
    });
};

const listarProductoById = (req, res) => {
  // 127.0.0.1:5000/producto/1
  let {id} = req.params;
  Producto.findOne({
    where: {
      productoId: id,
    },
  })
    .then((producto) => {
      // si no hay produto indicar que no hay producto en el message => usar operador ternario y mandar un status 404
      return producto
        ? res.json({
            ok: true,
            content: producto,
            message: null,
          })
        : res.status(404).json({
            ok: true,
            content: producto,
            message: "No hay producto",
          });
    })
    .catch((error) => {
      return res.status(500).json({
        ok: false,
        content: error,
        message: "Hubo un error al buscar el producto",
      });
    });
};

const editarProductoById = (req, res) => {
  let {id} = req.params;
  Producto.update(req.body, {
    where: {
      productoId: id,
    },
  })
    .then(async (resultado) => {
      // validar primero si hubo alguna actualizacion
      // si hubo actualizacion indicar en el message que se actualizo y ademas en su content, retornar ese registro actualizado, con un status 201 ( hacer un select para que me devuelva el id, updateat y createdAt )
      // si no hubo actualizacion retornar el content null y en el message que no se actualizo
      if (resultado[0] !== 0) {
        let producto = await Producto.findOne({
          where: {productoId: id},
        });
        return res.status(201).json({
          ok: true,
          content: producto,
          message: "Se actualizo exitosamente el Producto",
        });
      } else {
        return res.json({
          ok: false,
          content: null,
          message: "No se encontro producto a actualizar",
        });
      }
    })
    .catch((error) =>
      res.status(500).json({
        ok: false,
        content: error,
        message: "Hubo un error al actualizar el producto",
      })
    );
};

const eliminarProductoById = async (req, res) => {
  let {id} = req.params;
  try {
    let producto = await Producto.destroy({
      where: {
        productoId: id,
      },
    });
    return producto === 1
      ? res.json({
          ok: true,
          content: null,
          message: "Se elimino el producto exitosamente",
        })
      : res.status(404).json({
          ok: false,
          content: null,
          message: "No se encontro el producto a eliminar",
        });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al eliminar el producto",
    });
  }
};

const listarProductoLikeName = async (req, res) => {
  let {nombre} = req.params;
  // SELECT * FROM T_PRODUCTO WHERE PROD_NOM LIKE '%NOMBRE%'....
  try {
    let productos = await Producto.findAll({
      where: {
        productoNombre: {
          [Op.substring]: nombre,
        },
      },
    });
    return res.json({
      ok: true,
      content: productos,
      message: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al buscar los productos",
    });
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  listarProductoById,
  editarProductoById,
  eliminarProductoById,
  listarProductoLikeName,
};
