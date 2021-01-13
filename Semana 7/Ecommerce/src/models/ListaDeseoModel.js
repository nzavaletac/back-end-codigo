const { DataTypes } = require('sequelize');

const lista_deseo_model = (conexion) => {
    return conexion.define('listaDeseos', {
        listaDeseoId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            field: 'lista_deseo_id'
        }
    }, {
        tableName: 't_lista_deseo',
        timestamps: false
    });
}
module.exports = lista_deseo_model;