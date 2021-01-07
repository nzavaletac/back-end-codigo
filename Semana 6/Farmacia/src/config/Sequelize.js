const { Sequelize } = require('sequelize');
const productoModel = require('../models/ProductoModel');
const tipoOperacionModel = require('../models/TipoOperacionModel');
const loteModel = require('../models/LoteModel');
const cabeceraOperacionModel = require('../models/CabeceraOperacionModel');

// 1ra forma es usando una URI
// https://sequelize.readthedocs.io/en/1.7.0/docs/usage/
// const conexion = new Sequelize('mysql://usuario:password@host:puerto/base_datos')

// 2da forma de conectarse a la bd
const conexion = new Sequelize(
    // base_datos, usuario, password
    "farmaciaSequelize", "root", "root",{
        host: "localhost",
        dialect: "mysql",
        timezone: "-05:00",// sirve para que los campos de auditoria se creen con la hora local
        logging: false, // sirve para que no muestre en la terminal todas las consultas SQL que se ejecutan internamente
        // opciones extras
        dialectOptions: {
            // para que al momento de mostrar fechas, las vuelva en string y no tener que hacer la conversion manual
            dateStrings : true
        }
    }
);

// Acá se crean las tablas en la base de datos
const Producto = productoModel(conexion);
const TipoOperacion = tipoOperacionModel(conexion);
const Lote = loteModel(conexion);
cabeceraOperacionModel(conexion);

// Una vez definidos todos los modelos, se procede a crear las relaciones
// Producto tiene muchos Lotes
Producto.hasMany(Lote, {foreignKey: 'prod_id'});
// para usar las relaciones inversas ahora hacemos lo contrario
// Lote pertenece a Producto
Lote.belongsTo(Producto, {foreignKey: 'prod_id'});
module.exports = {
    conexion
}