const { DataTypes } = require('sequelize');

const usuario_model = (conexion) => {
    let usuario = conexion.define('usuarios', {
        usuarioId: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
            field: "usuario_id",
        },
        usuarioCorreo: {
            type: DataTypes.STRING(30),
            field:"usuario_correo",
            unique: true,
            allowNull: false,
            // https://sequelize.org/master/manual/validations-and-constraints.html#validators
            validate:{
                isEmail: true,
                isAlphanumeric: true,
                len: [10, 30],
            },
        },
        usuarioNombre: {
            type: DataTypes.STRING(45),
            field: "usuario_nombre",
            unique: true,
            allowNull: false
        },
        usuarioDireccion: {
            type: DataTypes.STRING(40),
            field: "usuario_direccion"
        },
        usuarioTelefono: {
            field: "usuario_telefono",
            type: DataTypes.STRING(10),
            unique: true,
            validate: {
                isNumeric: true,
                min: 900000000,
                max: 999999999
            }
        },
        usuarioHash: {
            field: "usuario_hash",
            type: DataTypes.TEXT
        },
        usuarioSalt: {
            field: "usuario_salt",
            type: DataTypes.TEXT
        },
        usuarioFechaNacimiento: {
            field: "usuario_fecha_nacimiento",
            type: DataTypes.DATEONLY
        }
    }, {
        tableName: "t_usuario",
        timestamps: false
    });
    // va a ir la encriptacion de la contraseña
    return usuario;
}
module.exports = usuario_model;