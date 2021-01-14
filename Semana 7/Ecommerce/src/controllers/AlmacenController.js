const { Almacen } = require("../config/Sequelize");

const createAlmacen = (req, res) => {
  Almacen.build(req.body)
    .then((objAlmacen) => {
      // anidamiento de promesas
      console.log("1");
      return Almacen.save(objAlmacen);
    })
    .then((almacenCreado) => {
      console.log("2");
      return res.status(201).json({
        ok: true,
        content: almacenCreado,
        message: null,
      });
    })
    .catch((error) => {
      return res.json({
        ok: false,
        content: error,
        message: "Hubo un error al crear el almacen",
      });
    });
};

module.exports = {
  createAlmacen,
};
