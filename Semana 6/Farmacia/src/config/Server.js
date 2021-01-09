const express = require('express');
const bodyParser = require('body-parser');
const {conexion} = require('./Sequelize');
const producto_router = require('../routes/ProductoRouter');
const lote_router = require('../routes/LoteRouter');
const tipo_operacion_router = require('../routes/TipoOperacionRouter');
const operacion_router = require('../routes/OperacionRouter');
module.exports = class Server {
    constructor(){
        this.app = express();
        this.puerto = process.env.PORT || 5000;
        this.CORS();
        this.configurarBodyParser();
        this.rutas();
    }
    CORS(){
        // los cors son el control de acceso a nuestra API si se quiere consultar desde un frontend
        this.app.use((req, res, next)=>{
            // Access-Control-Allow-Origin = indica que dominio o dominios pueden acceder a mi API, si uso * significa que voy a permitir que todos los dominios puedan acceder sin problemas
            res.header('Access-Control-Allow-Origin','*');
            // Access-Control-Allow-Header = sirve para indicar que tipos de cabeceras me puede mandar el front, si no la declaro será rechazada
            // https://developer.mozilla.org/es/docs/Web/HTTP/Headers
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            // Access-Control-Allow-Methods = sirve para indiccar que metodos van a poder ser consultados por el front
            res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
            // next() = es para indicar que todo fue exitoso y puede continuar con la peticion correspondiente
            next();
        });
    }
    configurarBodyParser(){
        this.app.use(bodyParser.json());
    }
    rutas(){
        this.app.get('/',(req,res)=>{
            res.json({
                message:'Bienvenido a mi API'
            });
        });
        this.app.use('',producto_router);
        this.app.use('',lote_router);
        this.app.use('',tipo_operacion_router);
        this.app.use('', operacion_router);
    }
    start(){
        this.app.listen(this.puerto, ()=>{
            console.log('Servidor corriendo exitosamente');
            // https://sequelize.org/master/manual/model-basics.html#model-synchronization
            // force: true => va a resetear toda la base de datos, va a borrar todas las tablas y las va a volver a crear de 0, tendremos perdida de datos y empezara limpia desde 0
            // alter: true => verifica que los modelos esten igual que las tablas, si hay algun cambio solamente hara ese cambio mas no reseteará todas las tablas y mucho menos habrá perdida de información
            // sus valores por defecto en ambos casos, son false
            // si dejamos el sync sin ningun parametro => crea las tablas si no existen y no hace nada si ya existen
            conexion.sync().then(()=>{
                console.log('Base de datos sincronizada correctamente');
            })
        });
    }
}
