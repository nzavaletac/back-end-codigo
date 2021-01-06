const Sequelize = require('sequelize');
const productoModel = require('../models/ProductoModel');

const conexion = new Sequelize(
    // base_datos, usuario, password
    "farmaciaSequelize", "root", "root",{
        host: "localhost",
        dialect: "mysql",
        timezone: "-05:00",// sirve para que los campos de auditoria se creen con la hora local
        // opciones extras
        dialectOptions: {
            // para que al momento de mostrar fechas, las vuelva en string y no tener que hacer la conversion manual
            dateStrings : true
        }
    }
);

// Acá se crean las tablas en la base de datos
const Producto = productoModel(conexion);

module.exports = {
    conexion
}