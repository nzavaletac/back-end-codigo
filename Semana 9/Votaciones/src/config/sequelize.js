const { Sequelize } = require("sequelize");
const congresita_model = require("../models/congresista");
const elector_model = require("../models/elector");
const partido_model = require("../models/partido");
const voto_congresal_model = require("../models/voto_congresal");
const voto_model = require("../models/voto");
const conexion = new Sequelize("elecciones", "root", "root", {
  host: "127.0.0.1",
  dialect: "mysql",
  timezone: "-05:00",
  logging: false,
  dialectOptions: {
    dateStrings: true,
  },
});
const Partido = partido_model(conexion);
const Elector = elector_model(conexion);
const Voto = voto_model(conexion);
const VotoCongresal = voto_congresal_model(conexion);
const Congresista = congresita_model(conexion);
// crear las relaciones
// Relacion de uno a uno pero aun así se debe de crear la FK
Elector.hasOne(Voto, { foreignKey: { name: "elector_dni", allowNull: false, unique:true } });
Voto.belongsTo(Elector, { foreignKey: "elector_dni" });
// 
// podemos controlar la forma en la cual va a accionar la llave foranea cuando su padre sea eliminado, TODAS ESTAS FORMAS VALEN PARA CUALQUIER TIPO DE RELACION (ONE-TO-ONE | ONE-TO-MANY)
// RESTRICT => No va a permitir la eliminacion (valor x defecto)
// CASCADE => eliminara al padre y luego a todos sus hijos
// NO ACTION => Lo deja asi tal y como esta con la fk sin modificar
// SET NULL => cambiar su valor de la FK a null
// SET DEFAULT => este va de la mano con el defaultValue y si es eliminado se reemplazara su valor por el defaultValue

// ! Ejemplo de una relacion muchos a muchos
// Elector.belongsToMany(Voto, {through: 'ElectorVoto'});
// Voto.belongsToMany(Elector, {through: 'ElectorVoto'});
// ! Fin ejemplo

Elector.hasMany(VotoCongresal, { foreignKey: { name: "elector_dni", onDelete: 'CASCADE'} });
VotoCongresal.belongsTo(Elector, { foreignKey: "elector_dni" });

Partido.hasMany(Voto, {as:'votos', foreignKey:{name:'partido_id', allowNull:false}});
Voto.belongsTo(Partido, {as:'partidos', foreignKey:'partido_id'});

Partido.hasMany(Congresista, {as:'congresistas', foreignKey:{name:'partido_id', allowNull:false}});
Congresista.belongsTo(Partido, {as:'partidos', foreignKey:'partido_id'});

Congresista.hasMany(VotoCongresal, {as: 'votosCongresales', foreignKey:{name:'congresista_id', allowNull:false}});
VotoCongresal.belongsTo(Congresista, {as: 'congresistas', foreignKey:'congresista_id'});

module.exports = {
  conexion,
  Partido,
  Elector,
  Voto,
  VotoCongresal,
  Congresista,
};
