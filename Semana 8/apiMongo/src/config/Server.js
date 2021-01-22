const express = require("express");
// const bodyParser = require("body-parser");
const { json } = require("body-parser");
const { connect } = require("mongoose");
const usuario_router = require("../routes/Usuario");

module.exports = class Server {
  constructor() {
    this.app = express();
    this.puerto = process.env.PORT || 5000;
    this.CORS();
    this.configurarBodyParser();
    this.rutas();
    this.connectarMongoDb();
  }
  CORS() {
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Header", "Content-Type");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      next();
    });
  }
  configurarBodyParser() {
    this.app.use(json());
  }
  rutas() {
    this.app.get("/", (req, res) => {
      return res.json({
        ok: true,
        message: "La API funciona exitosamente 👌",
        content: null,
      });
    });
    // this.app.use("", usuario_router);
  }
  connectarMongoDb() {
    // connect("mongodb+srv://m001-student:mongodbatlas@pruebas.9uqnz.mongodb.net/crud?retryWrites=true&w=majority");
    connect("mongodb://localhost:27017/crud",{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex:true
    });
  }
  start() {
      this.app.listen(this.puerto, ()=>{
          console.log("Servidor corriendo exitosamente en el puerto", this.puerto);
      })
  }
};
