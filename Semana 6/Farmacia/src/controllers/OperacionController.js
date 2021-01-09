const {CabeceraOperacion, DetalleOperacion, TipoOperacion, Lote, conexion} = require('../config/Sequelize');
const crearOperacion = async(req,res)=>{
    const t = await conexion.transaction();
    try {
        // Tengo que ver si ese tipo de Operacion existe
        let {tipo, fecha, cliente, direccion, total, igv, ruc, productos} = req.body;
        let tipoObj = await TipoOperacion.findOne({
            where: {
                tipoOperacionDescripcion : tipo
            }
        });
        if(tipoObj == null){
            return res.status(400).json({
                ok : false,
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
        let nuevaCabecera = await CabeceraOperacion.create(objCabecera,{transaction: t});
        // iterar los productos
        // uso del forin
        for(const key in productos){
            let lote = await Lote.findOne({
                where:{
                    loteDescripcion: productos[key].lote
                }
            });
            if (lote===null){
                // si entra a esta condicional significa que hubo un error en la busqueda del lote y por ende toda la transaccion de guardar cabecera y detalle ya no sirve y para evitar crear informacion incoherente en la bd hacemos un rollback (retroceder en el tiempo)
                await t.rollback();
                return res.status(400).json({
                    ok :false,
                    content: null,
                    message:`Lote ${productos[key].lote} no existe`
                })
            }
            if (lote.loteCantidad < productos[key].cantidad){
                await t.rollback();
                return res.status(400).json({
                    ok: false,
                    content: null,
                    message: `Lote ${productos[key].lote} no tiene la suficiente cantidad`
                })
            }
            console.log(lote);
            // en cada producto iterado validar si existe el lote y si tiene la cantidad suficiente para la venta, de no ser asi, indicar la falta de alguno de ellos.
            console.log(productos[key]);
        }
        // aqui si todo ha sucedido exitosamente y no hubo ningun error todos los cambios realizados en la base de datos se guardaran RECIEN gracias al commit
        await t.commit();
        
        return res.json({
            ok:true,
            // content: nuevaCabecera
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
const listarOperaciones = (req, res) =>{

};
const filtroOperaciones = (req, res)=>{

};
module.exports = {
    crearOperacion,
    listarOperaciones,
    filtroOperaciones
}
