const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = cabecera_operacion_model = conexion => conexion.define('cabecera_operaciones', {
    cabeceraOperacionId: {
        type: DataTypes.INTEGER,
        field: 'cab_ope_id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    // que su valor por defecto sea el dia de hoy
    cabeceraOperacionFecha: {
        type: DataTypes.DATE,
        field: 'cab_ope_fech',
        defaultValue: Sequelize.NOW
    },
    // minimo 5 letras y que solo sea letras
    cabeceraOperacionNombre: {
        type: DataTypes.STRING(45),
        field: 'cab_ope_nomb',
        validate: {
            len: [5, 45],
            isAlpha: true
        }
    },
    // que solo sea alfanumerico
    cabeceraOperacionDireccion: {
        type: DataTypes.STRING(45),
        field: 'cab_ope_direc',
        validate: {
            isAlphanumeric: true
        }
    },
    // que sea minimo 25 y maximo 1000
    cabeceraOperacionTotal: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'cab_ope_total',
        validate: {
            min: 25,
            max: 1000
        }
    },
    cabeceraOperacionIGV: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'cab_ope_igv'
    },
    cabeceraOperacionRUC: {
        type: DataTypes.STRING(11),
        field: 'cab_ope_ruc'
    }
}, {
    tableName: 't_cabecera_operacion',
    timestamps: false
})