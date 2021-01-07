const Sequelize, {DataTypes} = require('sequelize');
// Sequelize.NOW;

module.exports = cabecera_operacion_model = conexion => conexion.define('cabecera_operaciones',{
    cabeceraOperacionId: {
        type: DataTypes.INTEGER,
        field:'cab_ope_id'
    },
    // que su valor por defecto sea el dia de hoy
    cabeceraOperacionFecha: {
        type:DataTypes.DATE,
        field:'cab_ope_fecg'
    }, 
     // minimo 5 palabras y maximo 40 y que solo sea letras
    cabeceraOperacionNombre: {
        type:DataTypes.STRING(45),
        field:'cab_ope_nomb'
    },
    // que solo sea alfanumerico
    cabeceraOperacionDireccion: {
        type:DataTypes.STRING(45),
        field:'cab_ope_direc'
    }, 
    // que sea minimo 25 y maximo 1000
    cabeceraOperacionTotal: {
        type:DataTypes.DECIMAL(5,2),
        field:'cab_ope_total'
    }, 
    cabeceraOperacionIGV: {
        type:DataTypes.DECIMAL(5,2),
        field:'cab_ope_igv'
    }, 
    cabeceraOperacionRUC: {
        type:DataTypes.STRING(12),
        field:'cab_ope_ruc'
    } 
})