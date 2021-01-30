const { Voto, VotoCongresal } = require("../config/sequelize");

const crearVoto = (req, res) => {
  // Como me deberia mandar el front el body??
  /**
   * {
   *    voto_presidencial: id_partido,
   *    voto_congresal:{
   *        primer_congresista: id_congresista,
   *        segundo_congresista: id_congresista
   *    }
   * } 
   */

};
module.exports = {
  crearVoto,
};
