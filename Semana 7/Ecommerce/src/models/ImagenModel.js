const { DataTypes } = require('sequelize');

const imagen_model = (conexion) => {
    return conexion.define('imagenes', {
        imagenId: {
            primaryKey: true,
            field:'imagen_id',
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        imagenURL: {
            type: DataTypes.TEXT,
            field: 'imagen_url',
            allowNull: false
        }
    },{
        tableName: 't_imagen',
        timestamps: false
    })
}
module.exports = imagen_model;