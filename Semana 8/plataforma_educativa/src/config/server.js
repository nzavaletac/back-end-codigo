import express from "express"; // asi se maneja la importacion en TS
// const express = require("express");
const bodyParser = require("body-parser");
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
  }
  conectarMongoDb() {}
  start() {
    this.app.listen(this.puerto, () =>
      console.log("Servidor corriendo exitosamente en el puerto", this.puerto)
    );
  }
};
