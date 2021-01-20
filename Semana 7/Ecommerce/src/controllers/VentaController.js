const {CabeceraVenta, DetalleVenta, Usuario, Producto} = require("../config/Sequelize");

const crearVenta = async(req, res)=>{
    let {fecha, total, igv, usuario, productos} = req.body;
    // Pasos a realizar:
    // Validar que exista el usuario y que el producto exista
    let usuarioEncontrado = await Usuario.findByPk(usuario);
    let productoEncontrado = true;
    for (const key in productos) {
        // Validar que el producto tenga la categoria activa, usar include 
        let producto = await Producto.findOne({
            where:{
                productoId:productos[key].producto
            },
            //...
        });
        if(producto === null){
            productoEncontrado = false;
            // el break hace que el bucle, switch o condicional termine
            break;
            // el return hace devolver una respuesta a la funcion , en este caso al controlador
        }
    }
    if (productoEncontrado === false || usuarioEncontrado === null){
        return res.status(400).json({
            ok :false,
            message: 'Producto o Usuario incorrectos intente nuevamente',
            content: null
        })
    }
    return res.json({
        ok:true
    });
    
    // 1. Revisar si los productos cuentan con la cantidad suficiente
    // 2. Crear la cabecera
    // 3. Crear el detalle
    // 4. Sacar los calculos
    // 5. Restar el inventario
    // 7. Borrar el contenido del carrito de ese usuario
    // 6. Devolver el resultado
    
}

const mostrarVentasDelUsuario = (req, res)=>{}

module.exports = {
    crearVenta,
    mostrarVentasDelUsuario
}