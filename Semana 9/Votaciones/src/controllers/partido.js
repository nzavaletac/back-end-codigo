const { Partido } = require("../config/sequelize");

const crearPartido = async (req, res) => {
  // hacer el crear partido 👀
  // sin await y sin async y todo trabaja dentro de la misma promesa
  /*
  Partido.create(req.body)
    .then((partidoCreado) =>
      res.status(201).json({
        ok: true,
        content: partidoCreado,
        message: null,
      })
    )
    .catch((error) =>
      res.status(500).json({
        ok: false,
        content: error,
        message: "Hubo un error al crear el partido",
      })
    );
  */
  // metodo con async await
  try {
    // let partidoCreado = await Partido.build(req.body).save();
    let partidoCreado = await Partido.create(req.body);
    return res.status(201).json({
      ok: true,
      content: partidoCreado,
      message: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      content: error,
      message: "Hubo un error al crear el partido",
    });
  }
};

module.exports = {
  crearPartido,
};
