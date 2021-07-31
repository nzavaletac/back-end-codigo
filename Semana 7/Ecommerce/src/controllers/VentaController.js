const {
  CabeceraVenta,
  DetalleVenta,
  Usuario,
  Producto,
  Categoria,
  Carrito,
  conexion,
} = require("../config/Sequelize");

const crearVenta = async (req, res) => {
  const miTransaccion = await conexion.transaction();
  let {fecha, total, igv, usuario, productos} = req.body;
  try {
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
    let cabeceraCreada = await CabeceraVenta.create(
      {
        cabeceraVentaFecha: fecha,
        cabeceraVentaTotal: total,
        cabeceraVentaIGV: igv,
        usuario_id: usuarioEncontrado.usuarioId,
      },
      {transaction: miTransaccion}
    );
    // 3. Crear el detalle
    for (const posicion in productos) {
      let producto = await Producto.findByPk(productos[posicion].producto);
      // 4. Sacar los calculos
      await DetalleVenta.create(
        {
          detalleVentaCantidad: productos[posicion].cantidad,
          detalleVentaPrecio: productos[posicion].precio,
          detalleVentaTotal:
            productos[posicion].precio * productos[posicion].cantidad,
          producto_id: producto.productoId,
          cabventa_id: cabeceraCreada.cabeceraVentaId,
        },
        {transaction: miTransaccion}
      );
      // 5. Restar el inventario
      producto.productoCantidad =
        producto.productoCantidad - productos[posicion].cantidad;
      producto.save({transaction: miTransaccion});
      // producto.productoCantidad -= productos[posicion].cantidad
    }
    // 7. Borrar el contenido del carrito de ese usuario USANDO TRANSACTION
    // 7.1 Buscar primero en el modelo carrito lo que coincida segun ese usuario
    // 7.2 Borrar los registro del carrito segun el usuario encontrado
    // usuarioEncontrado <= variable que ya tengo guardado todo mi usuario
    let carritoEncontrado = await Carrito.findOne({
      where: {
        usuario_id: usuarioEncontrado.usuarioId,
      },
    });
    if (carritoEncontrado) {
      Carrito.destroy(
        {
          where: {
            usuario_id: usuarioEncontrado.usuarioId,
          },
        },
        {transaction: miTransaccion}
      );
    }
    // 6. Devolver el resultado
    await miTransaccion.commit();
    return res.status(201).json({
      ok: true,
      content: null,
      message: "La compra se realizó exitosamente",
    });
  } catch (error) {
    await miTransaccion.rollback();
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al realizar la venta",
    });
  }
};

const mostrarVentasDelUsuario = (req, res) => {};

module.exports = {
  crearVenta,
  mostrarVentasDelUsuario,
};
