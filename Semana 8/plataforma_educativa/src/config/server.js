// import express from "express"; // asi se maneja la importacion en TS
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usuario_router = require("../routes/usuario");
const curso_router = require("../routes/curso");
const imagen_router = require("../routes/imagen");

module.exports = class Server {
  constructor() {
    this.app = express();
    this.puerto = process.env.PORT || 5000;
    this.CORS();
    this.configurarBodyParser();
    this.rutas();
    this.conectarMongoDb();
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
  rutas() {
    this.app.get("/", (req, res) =>
      res.json({
        ok: true,
        content: "La api funciona exitosamente",
      })
    );
    this.app.use("", usuario_router, curso_router, imagen_router);
    
  }
  conectarMongoDb() {
    // mongodb+srv://m001-student:mongodbatlas@pruebas.9uqnz.mongodb.net/plataforma_educativa_eduardo?retryWrites=true&w=majority
    mongoose.connect("mongodb://localhost:27017/plataforma_educativa", {
      // https://mongoosejs.com/docs/connections.html#options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }).then(()=>{
      console.log('Base de datos conectada exitosamente! 😀');
    }).catch((error)=>{
      console.log(error);
    });
  }
  start() {
    this.app.listen(this.puerto, () =>
      console.log("Servidor corriendo exitosamente en el puerto", this.puerto)
    );
  }
};
