const { Sequelize } = require('sequelize');
const productoModel = require('../models/ProductoModel');
const tipoOperacionModel = require('../models/TipoOperacionModel');
const loteModel = require('../models/LoteModel');
const cabeceraOperacionModel = require('../models/CabeceraOperacionModel');
const detalleOperacionModel = require('../models/DetalleOperacionModel');
// 1ra forma es usando una URI
// https://sequelize.readthedocs.io/en/1.7.0/docs/usage/
// const conexion = new Sequelize('mysql://usuario:password@host:puerto/base_datos')

// 2da forma de conectarse a la bd
const conexion = new Sequelize(
    // base_datos, usuario, password
    "farmaciaSequelize", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-05:00",// sirve para que los campos de auditoria se creen con la hora local
    logging: false, // sirve para que no muestre en la terminal todas las consultas SQL que se ejecutan internamente
    // opciones extras
    dialectOptions: {
        // para que al momento de mostrar fechas, las vuelva en string y no tener que hacer la conversion manual
        dateStrings: true
    }
}
);

// Acá se crean las tablas en la base de datos
const Producto = productoModel(conexion);
const TipoOperacion = tipoOperacionModel(conexion);
const Lote = loteModel(conexion);
const CabeceraOperacion = cabeceraOperacionModel(conexion);
const DetalleOperacion = detalleOperacionModel(conexion);
// Una vez definidos todos los modelos, se procede a crear las relaciones
// Producto tiene muchos Lotes
// https://sequelize.org/master/manual/assocs.html
// si deseamos que una llave foranea no acepte valores nulos, aparte de su nombre se puede indicar su propiedad que allowNull:false
Producto.hasMany(Lote,{ foreignKey:{name:'prod_id', allowNull: false}});
// para usar las relaciones inversas ahora hacemos lo contrario
// Lote pertenece a Producto
Lote.belongsTo(Producto,{ foreignKey:'prod_id'});
TipoOperacion.hasMany(CabeceraOperacion, { foreignKey: 'tipo_ope_id' });
CabeceraOperacion.belongsTo(TipoOperacion, { foreignKey: 'tipo_ope_id' });

Lote.hasMany(DetalleOperacion, { foreignKey: 'lote_id' });
DetalleOperacion.belongsTo(Lote, { foreignKey: 'lote_id' });
CabeceraOperacion.hasMany(DetalleOperacion, { foreignKey: 'cab_ope_id' });
DetalleOperacion.belongsTo(CabeceraOperacion, { foreignKey: 'cab_ope_id' });


module.exports = {
    conexion,
    Producto,
    Lote,
    DetalleOperacion,
    CabeceraOperacion,
    TipoOperacion
}