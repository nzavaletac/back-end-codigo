const { TipoOperacion } = require('../config/Sequelize');
const {Op} = require('sequelize');
// CREATE y Update
const crearTipoOperacion = async(req, res) => {
    try {
        let nuevoTipoOperacion = await TipoOperacion.create(req.body);
        return res.status(201).json({
            ok: true,
            content: nuevoTipoOperacion,
            message: 'Se creo exitosamente el Tipo de Operacion'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            content: error,
            message:'Hubo un error al crear el tipo de operacion'
        })
    }
};

const actualizarTipoOperacion = async(req, res)=>{
    try {
        let resultado = await TipoOperacion.update(req.body,{
            where:{
                // tipoOperacionId : req.params.id,
                tipoOperacionId: {
                    [Op.eq]: req.params.id
                }
            }
        });
        return res.status(resultado == 1 ? 200: 404).json({
            ok: true,
            content: null,
            message: resultado == 1 ? 'Se actualizo exitosamente el tipo de operacion': 'No se encontro el tipo de operacion a actualizar',
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            content: error,
            message: 'Hubo un error al actualizar el tipo de operacion'
        })
    }
}

module.exports = {
    crearTipoOperacion,
    actualizarTipoOperacion
}