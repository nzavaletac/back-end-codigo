const { Lote, Producto, DetalleOperacion } = require('../config/Sequelize');
const { Op } = require('sequelize');
const crearLote = async (req, res) => {
    try {
        // usando el build() se tiene que hacer en dos pasos, el primero construye el objeto y esta listo para mandar a la bd (se hace las validaciones si es que hubiesen)
        let nuevoLote = Lote.build(req.body);
        // luego usamos el metodo save() que si se encarga de almacenas en la bd, y como va a tener un tiempo de respuesta retorna una promesa
        let loteCreado = await nuevoLote.save();
        return res.status(201).json({
            ok: true,
            content: loteCreado,
            message: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            content: error,
            message: 'Hubo un error al guardar en la bd'
        })
    }
}

const buscarLote = async (req, res) => {
    let { fecha, fech_in, fech_fin, anio } = req.query;
    try {
        let lotes;
        if (fecha)// si la fecha no es undefined
        {
            lotes = await Lote.findAll({
                where: {
                    loteFechaVencimiento: fecha
                }
            })// Promise<Pending>
        } else if (fech_in && fech_fin) {
            lotes = await Lote.findAll({
                where: {
                    loteFechaVencimiento: {
                        [Op.between]: [fech_in, fech_fin]
                    }
                }
            });
        }else if(anio){
            // quitar el prod_id del resultado de lotes
            lotes = await Lote.findAll({
                where : {
                    loteFechaVencimiento: {
                        [Op.startsWith]: anio
                    }
                },
                include:{
                    model: Producto,
                    attributes: {
                        exclude: ['createdAt','updatedAt']
                    }
                },
                attributes: {
                    exclude: ['prod_id']
                }
            });
        }
        else {
            return res.json({
                ok: false,
                content: null,
                message: 'Falta los parametros de busqueda, puede mandar fecha, fech_in y fech_fin'
            })
        }
        return res.json({
            ok: true,
            content: lotes,
            message: null
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            content: error,
            message: 'Error al hacer la busqueda'
        })
    }
}
module.exports = {
    crearLote,
    buscarLote
}