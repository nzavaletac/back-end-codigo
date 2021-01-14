const { DataTypes } = require('sequelize');

const categoria_model = (conexion) => {
    // nombre en plural, json de los campos, json config de la tabla
    return conexion.define('categorias', {
        categoriaId: {
            primaryKey: true,
            field: 'categoria_id',
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoriaDescripcion: {
            field: 'categoria_descripcion',
            allowNull: false,
            type: DataTypes.STRING(50),
        },
        categoriaNombre: {
            field: 'categoria_nombre',
            unique: true,
            allowNull: false,
            type: DataTypes.STRING(15)
        },
        categoriaEstado: {
            field: 'categoria_estado',
            defaultValue: true,
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        tableName: 't_categoria',
        timestamps: false
    });
}
module.exports = categoria_model;