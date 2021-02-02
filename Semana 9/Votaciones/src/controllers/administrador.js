const {
  Voto,
  VotoCongresal,
  Partido,
  Congresista,
} = require("../config/sequelize");
const { Sequelize } = require("sequelize");

const resultadosPresidenciales = async (req, res) => {
  // el metodo count se encarga de contar todos los registros de la tabla
  // SELECT COUNT(*) FROM T_VOTO WHERE PARTIDO_ID=2;
  // console.log(await Voto.count({
  //     where:{
  //         partido_id:2
  //     }
  // }))
  // SELECT PARTIDO_ID,COUNT(*) FROM T_VOTO GROUP BY PARTIDO_ID;
  const votos = await Voto.count({
    attributes: ["partido_id"],
    group: ["partido_id"],
  });
  // Otra forma de hacer el conteo es usar las funciones internas de sequelize (Sequelize.fn())
  const votos2 = await Voto.findAll({
    attributes: [
      [
        Sequelize.fn("COUNT", Sequelize.col("votos.partido_id")),
        "numero_votos",
      ],
    ],
    group: ["votos.partido_id"],
    include: {
      model: Partido,
      as: "partidos",
    },
  });
  console.log(votos);
  return res.json({
    ok: true,
    content: votos,
    content2: votos2,
    message: null,
  });
};

const resultadosCongresalesPaginados = async (req, res) => {
  // Devolver todos los resultados (count) de los congresistas en el cual, además, se incluya el nombre del congresista y tambien su nombre del partido
  /**
   * {
   *  ok:true,
   *  content:{
   *     numero_votos:10,
   *     congresista:{
   *          congresista_nombre: "juan martinez",
   *          congresista_numero: 10,
   *          partido:{
   *              partido_nombre: "La naranja mecanica"
   *          }
   *     },
   *     numero_votos:15,
   *     congresista:{
   *          congresista_nombre: "maria rodriguez",
   *          congresista_numero: 7,
   *          partido:{
   *              partido_nombre: "La naranja mecanica"
   *          }
   *     }
   *  }
   * }
   */
  const votos = await VotoCongresal.findAll({
    attributes: [
      [
        Sequelize.fn("COUNT", Sequelize.col("congresistas.congresista_id")),
        "numero_votos",
      ],
    ],
    group: ["congresistas.congresista_id"],
    include: {
        attributes: ['congresista_numero','congresista_nombre'],
        model : Congresista,
        as: "congresistas",
        include:{
            model: Partido,
            as: 'partidos',
            attributes:['partido_nombre']
        }
    }
  });

  return res.json({
    ok: true,
    content: votos,
  });
};

module.exports = {
  resultadosPresidenciales,
  resultadosCongresalesPaginados,
};
