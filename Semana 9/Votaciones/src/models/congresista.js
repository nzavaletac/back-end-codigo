const { DataTypes } = require("sequelize");
const congresita_model = (conexion) => {
  const congresista = conexion.define(
    "congresistas",
    {
      congresista_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey:true
      },
      congresista_numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      congresista_nombre: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      tableName: "t_congresista",
      timestamps: false,
    }
  );
  return congresista;
};
module.exports = congresita_model;
