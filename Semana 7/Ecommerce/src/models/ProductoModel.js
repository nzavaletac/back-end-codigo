const { DataTypes } = require('sequelize');
const producto_model = (conexion) => {
    return conexion.define('productos', {
        productoId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'producto_id'
        },
        productoNombre: {
            type:DataTypes.STRING(25),
            field:'producto_nombre',
            allowNull: false,
        },
        productoDescripcion: {
            type:DataTypes.STRING(45),
            field:'producto_descripcion',
            allowNull: false,
        },
        productoMarca: {
            type:DataTypes.STRING(15),
            field:'producto_marca',
            allowNull: false,
        },
        productoPrecio: {
            type: DataTypes.DECIMAL(6,2),
            field:'producto_precio',
            allowNull: false,
            validate: {
                min: 10
            }
        },
        productoSku: {
            type: DataTypes.STRING(25),
            field:'producto_sku',
            allowNull:false,
        },
        productoDscto: {
            type:DataTypes.INTEGER,
            field:'producto_dscto',
            allowNull:false,
        },
        productoCantidad: {
            type:DataTypes.INTEGER,
            field:'producto_cantidad',
            allowNull:false,
        }
    }, {
        tableName: 't_producto',
        timestamps: false,
    })
};
module.exports = producto_model;