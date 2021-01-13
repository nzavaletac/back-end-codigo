const { DataTypes } = require('sequelize');
const cabecera_venta_model = (conexion) => {
    return conexion.define('cabeceraVentas', {
        cabeceraVentaId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'cabventa_id'
        },
        cabeceraVentaFecha: {
            type: DataTypes.DATEONLY,
            field: 'cabventa_fecha',
            allowNull: false
        },
        cabeceraVentaTotal: {
            type: DataTypes.DECIMAL(6,2),
            field: 'cabventa_total',
            allowNull: false
        },
        cabeceraVentaIGV: {
            type: DataTypes.DECIMAL(6,2),
            field: 'cabventa_igv',
            allowNull: false
        },
        // columna : DataTypes.INTEGER
    }, {
        tableName: 't_cabventa',
        timestamps: false
    })
}
module.exports = cabecera_venta_model;