const express = require("express");
const bodyParser = require("body-parser");
const {conexion} = require("./sequelize");
const partido_router = require("../routes/partido");
const elector_router = require("../routes/elector");
const voto_router = require("../routes/voto");
const exphbs = require("express-handlebars"); // npm i express-handlebars
module.exports = class Server {
  constructor() {
    this.app = express();
    this.puerto = process.env.PORT || 5000;
    this.CORS();
    this.configurarBodyParser();
    this.configurarHandleBars();
    this.rutas();
  }
  CORS() {
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Header", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      next();
    });
  }
  configurarBodyParser() {
    this.app.use(bodyParser.json());
  }
  configurarHandleBars(){
    // agrego al motor de express la extension de archivos 'handlebars' con su funcionalidad de la libreria
    this.app.engine('handlebars', exphbs());
    this.app.set('view engine', 'handlebars');
    // ahora modifico los archivos staticos, osea su ubicacion en el proyecto
    this.app.use(express.static('assets'));
    // __dirname es toda la ruta raiz de mi proyecto "c:/users/nombre_usuario/...."
    console.log(__dirname);
    this.app.use('/assets', express.static(__dirname+'/assets'));
  }
  rutas() {
    this.app.get("/", (req, res) => {
      res.json({
        ok: true,
        message: "Bienvenido a mi API de elecciones 😂",
      });
    });
    this.app.use("", partido_router, elector_router, voto_router);
  }
  start() {
    this.app.listen(this.puerto, () => {
      console.log("Servidor corriendo exitosamente!! 😍");
      conexion.sync().then(()=>{
          console.log('Base de datos sincronizada correctamente');
      })
    });
  }
};
