const { DataTypes } = require('sequelize');
const detalle_venta_model = (conexion) => {
    return conexion.define('detalleVentas', {
        detalleVentaId: {
            type: DataTypes.INTEGER,
            field: 'detventa_id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        detalleVentaCantidad: {
            type: DataTypes.INTEGER,
            field: 'detventa_cantidad',
            allowNull: false
        },
        detalleVentaPrecio: {
            type: DataTypes.DECIMAL(6, 2),
            field: 'detventa_precio',
            allowNull: false
        },
        detalleVentaTotal: {
            type: DataTypes.DECIMAL(6, 2),
            field: 'detventa_total',
            allowNull: false
        }
    }, {
        tableName: 't_detventa',
        timestamps: false
    })
}
module.exports = detalle_venta_model;