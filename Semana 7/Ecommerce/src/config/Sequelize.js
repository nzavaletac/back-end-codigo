const {Sequelize} = require('sequelize');
// CREATE DATABASE ecommerce_virtual4;
const conexion = new Sequelize(
    "ecommerce_virtual4","root","root",{
        host:"127.0.0.1",
        port:"3306",
        dialect:"mysql",
        timezone:"-05:00",
        logging: false,
        dialectOptions:{
            dateStrings: true
        }
    }
);
module.exports = {
    conexion: conexion
}