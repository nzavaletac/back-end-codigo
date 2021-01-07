const {DataTypes} = require('sequelize');

module.exports = detalle_operacion_model = conexion => conexion.define('detalle_operaciones',{
    detalleOperacionId: {
        primaryKey: true,
        autoIncrement: true,
        field: 'det_ope_id',
        type: DataTypes.INTEGER,
        allowNull: false
    },
    detalleOperacionCantidad: {
        type: DataTypes.INTEGER,
        field:'det_ope_cant',
        allowNull: false
    },
    detalleOperacionSubTotal: {
        type: DataTypes.DECIMAL(5,2),
        field:'det_ope_subtotal',
        allowNull: false
    }
},{
    tableName: 't_detalle_operacion',
    timestamps: false
})