const {Voto, VotoCongresal, Partido} = require("../config/sequelize");
const {Sequelize} = require("sequelize");

const resultadosPresidenciales = async (req,res)=>{
    // el metodo count se encarga de contar todos los registros de la tabla
    // SELECT COUNT(*) FROM T_VOTO WHERE PARTIDO_ID=2;
    // console.log(await Voto.count({
    //     where:{
    //         partido_id:2
    //     }
    // }))
    // SELECT PARTIDO_ID,COUNT(*) FROM T_VOTO GROUP BY PARTIDO_ID;
    const votos = await Voto.count({
        attributes:['partido_id'],
        group:['partido_id'],
    });
    // Otra forma de hacer el conteo es usar las funciones internas de sequelize (Sequelize.fn())
    const votos2 = await Voto.findAll({
        attributes : [[Sequelize.fn('COUNT', Sequelize.col('votos.partido_id')),'numero_votos']],
        group: ['votos.partido_id'],
        include:{
            model: Partido,
            as: 'partidos'
        }
    })
    console.log(votos);
    return res.json({
        ok:true,
        content: votos,
        content2: votos2,
        message: null
    })
}

const resultadosCongresalesPaginados = (req,res)=>{}

module.exports = {
    resultadosPresidenciales,
    resultadosCongresalesPaginados
}