const {
  CabeceraVenta,
  DetalleVenta,
  Usuario,
  Producto,
  Categoria,
  conexion,
} = require("../config/Sequelize");

const crearVenta = async (req, res) => {
  const miTransaccion = await conexion.transaction();
  let { fecha, total, igv, usuario, productos } = req.body;
  // Pasos a realizar:
  // Validar que exista el usuario y que el producto exista
  let usuarioEncontrado = await Usuario.findByPk(usuario);
  let productoEncontrado = true;
  for (const key in productos) {
    // Validar que el producto tenga la categoria activa, usar include

    let producto = await Producto.findOne({
      where: {
        productoId: productos[key].producto,
      },
      include: {
        model: Categoria,
        where: {
          categoriaEstado: true,
        },
      },
    });
    let cantidad_actual = producto.productoCantidad; // lo que yo tengo
    let cantidad_solicitada = productos[key].cantidad; // lo que me piden

    // 1. Revisar si los productos cuentan con la cantidad suficiente
    if (producto === null || cantidad_actual < cantidad_solicitada) {
      productoEncontrado = false;
      // el break hace que el bucle, switch o condicional termine
      break;
      // el return hace devolver una respuesta a la funcion , en este caso al controlador
    }
  }
  if (productoEncontrado === false || usuarioEncontrado === null) {
    return res.status(400).json({
      ok: false,
      message: "Producto o Usuario incorrectos intente nuevamente",
      content: null,
    });
  }
  
  // 2. Crear la cabecera
  let cabeceraCreada = await CabeceraVenta.create({
      cabeceraVentaFecha: fecha,
      cabeceraVentaTotal: total,
      cabeceraVentaIGV: igv
  },{transaction: miTransaccion});
  // 3. Crear el detalle
  // 4. Sacar los calculos
  // 5. Restar el inventario
  // 7. Borrar el contenido del carrito de ese usuario
  // 6. Devolver el resultado
};

const mostrarVentasDelUsuario = (req, res) => {};

module.exports = {
  crearVenta,
  mostrarVentasDelUsuario,
};
