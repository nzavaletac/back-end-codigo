const { CabeceraOperacion, DetalleOperacion, TipoOperacion, Lote, conexion, Producto } = require('../config/Sequelize');
const crearOperacion = async (req, res) => {
    const t = await conexion.transaction();
    try {
        // Tengo que ver si ese tipo de Operacion existe
        let { tipo, fecha, cliente, direccion, total, igv, ruc, productos } = req.body;
        let tipoObj = await TipoOperacion.findOne({
            where: {
                tipoOperacionDescripcion: tipo
            }
        });
        if (tipoObj == null) {
            return res.status(400).json({
                ok: false,
                content: null,
                message: 'Tipo de Venta incorrecto'
            });
        }
        let objCabecera = {
            cabeceraOperacionFecha: fecha,
            cabeceraOperacionNombre: cliente,
            cabeceraOperacionDireccion: direccion,
            cabeceraOperacionTotal: total,
            cabeceraOperacionIGV: igv,
            cabeceraOperacionRUC: ruc,
            tipo_ope_id: tipoObj.tipoOperacionId
        }
        // si quiero usar el save va despues de hacer un build
        // let nuevaCabecera = await CabeceraOperacion.build(objCabecera).save();
        let nuevaCabecera = await CabeceraOperacion.create(objCabecera, { transaction: t });
        // iterar los productos
        // uso del forin
        for (const key in productos) {
            let lote = await Lote.findOne({
                where: {
                    loteDescripcion: productos[key].lote
                }, include: {
                    model: Producto
                }
            });
            if (lote === null) {
                // si entra a esta condicional significa que hubo un error en la busqueda del lote y por ende toda la transaccion de guardar cabecera y detalle ya no sirve y para evitar crear informacion incoherente en la bd hacemos un rollback (retroceder en el tiempo)
                await t.rollback();
                return res.status(400).json({
                    ok: false,
                    content: null,
                    message: `Lote ${productos[key].lote} no existe`
                })
            }
            if (lote.loteCantidad < productos[key].cantidad) {
                await t.rollback();
                return res.status(400).json({
                    ok: false,
                    content: null,
                    message: `Lote ${productos[key].lote} no tiene la suficiente cantidad`
                })
            }
            // AGREGAR ESE producto (lote) a un detalle de operacion y de acuerdo al precio del producto(tabla) agregar el subtotal al detalle de operacion, no olvidar adjuntar la transaction a la creacion
            // para buscar el precio => lote.producto....
            if(lote.producto === null){
                await t.rollback();
                return res.json({
                    ok: false,
                    message: 'Lote no tiene producto'
                })
            }
            let subTotal = lote.producto.productoPrecio * productos[key].cantidad; 
            let objDetalleOperacion = {
                detalleOperacionCantidad: productos[key].cantidad,
                detalleOperacionSubTotal: subTotal,
                lote_id: lote.loteId,
                cab_ope_id: nuevaCabecera.cabeceraOperacionId
            }
            await DetalleOperacion.create(objDetalleOperacion,{transaction: t});
            // modificar la cantidad de ese lote porque ya lo vendí!
            let nuevaCantidad = lote.loteCantidad - productos[key].cantidad
            await lote.update({
                loteCantidad: nuevaCantidad
            }, {transaction:t})
        }
        // aqui si todo ha sucedido exitosamente y no hubo ningun error todos los cambios realizados en la base de datos se guardaran RECIEN gracias al commit
        await t.commit();

        return res.status(201).json({
            ok: true,
            message:'Se agrego la operacion exitosamente',
            content: null
        })
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
            ok: false,
            content: error
        })

    }

};
const listarOperaciones = (req, res) => {
    // listar todas las Operaciones con sus detalles y sus lotes
    /*
    {
        "fecha":"2021-01-12",
        "nombre":"eduardo",
        "direccion":"calel..",
        "total":150,
        "igv":15,
        "ruc":"123123123",
        "detalle":[
            {
                "cantidad":1,
                "subtotal":15.40,
                "lote":{
                    "descripcion":"1234",
                    "fecha_vencimiento":"2021-12-31"
                }
            },
            {
                "cantidad":4,
                "subtotal":25.80,
                "lote":{
                    "descripcion":"4578",
                    "fecha_vencimiento":"2021-10-11"
                }
            }
        ]
    }
    */
};
const filtroOperaciones = (req, res) => {

};
module.exports = {
    crearOperacion,
    listarOperaciones,
    filtroOperaciones
}
