const express = require("express");
const bodyParser = require("body-parser");
module.exports = class Server {
  constructor() {
    this.app = express();
    this.puerto = process.env.PORT || 5000;
    this.CORS();
    this.configurarBodyParser();
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
  rutas() {
    this.app.get("/", (req, res) => {
      res.json({
        ok: true,
        message: "Bienvenido a mi API de elecciones 😂",
      });
    });
  }
  start() {
    this.app.listen(this.puerto, () => {
      console.log("Servidor corriendo exitosamente!! 😍");
    });
  }
};
