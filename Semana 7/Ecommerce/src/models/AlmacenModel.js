const { DataTypes } = require('sequelize');

const almacen_model = (conexion) => {
    return conexion.define('almacenes', {
        almacenId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: 'almacen_id',
            autoIncrement: true,
            primaryKey: true
        },
        almacenDireccion: {
            field: 'almacen_direccion',
            type: DataTypes.STRING(45)
        },
        almacenLatitud: {
            type: DataTypes.DECIMAL(8, 6),
            field: 'almacen_latitud'
        },
        almacenLongitud: {
            type: DataTypes.DECIMAL(8, 6),
            field: 'almacen_longitud'
        }
    }, {
        tableName: 't_almacen',
        timestamps: false
    })
}
module.exports = almacen_model;