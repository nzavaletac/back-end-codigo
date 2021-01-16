const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const usuario_model = (conexion) => {
  let usuario = conexion.define(
    "usuarios",
    {
      usuarioId: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        field: "usuario_id",
      },
      usuarioCorreo: {
        type: DataTypes.STRING(30),
        field: "usuario_correo",
        unique: true,
        allowNull: false,
        // https://sequelize.org/master/manual/validations-and-constraints.html#validators
        validate: {
          isEmail: true,
          //   isAlphanumeric: true,
          len: [10, 30],
        },
      },
      usuarioNombre: {
        type: DataTypes.STRING(45),
        field: "usuario_nombre",
        unique: true,
        allowNull: false,
      },
      usuarioDireccion: {
        type: DataTypes.STRING(40),
        field: "usuario_direccion",
      },
      usuarioTelefono: {
        field: "usuario_telefono",
        type: DataTypes.STRING(10),
        unique: true,
        validate: {
          isNumeric: true,
          min: 900000000,
          max: 999999999,
        },
      },
      usuarioHash: {
        field: "usuario_hash",
        type: DataTypes.TEXT,
      },
      usuarioSalt: {
        field: "usuario_salt",
        type: DataTypes.TEXT,
      },
      usuarioFechaNacimiento: {
        field: "usuario_fecha_nacimiento",
        type: DataTypes.DATEONLY,
      },
      usuarioTipo: {
        field: "usuario_tipo",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "t_usuario",
      timestamps: false,
    }
  );
  // Si queremos usar prototypes, se recomienda no usar arrow functions sino usar funciones anonimas
  // va a ir la encriptacion de la contraseña
  usuario.prototype.setSaltAndHash = function (password) {
    // uso su metodo randomBytes el cual va a generar una cadena aleatoria de bytes con una longitud de 16 bits y luego eso lo convierto a string
    // https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
    this.usuarioSalt = crypto.randomBytes(16).toString("hex");
    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2sync_password_salt_iterations_keylen_digest
    this.usuarioHash = crypto
      .pbkdf2Sync(password, this.usuarioSalt, 1000, 64, "sha512")
      .toString("hex");
  };
  usuario.prototype.generarJWT = function () {
    // generar payload
    // payload es la parte intermedia de la JWT  y sirve para guardar informacion de tiempo de vida e informacion adicional como el nombre del usuario, tipo de usuario, etc
    let payload = {
      usuarioId: this.usuarioId,
      usuarioNombre: this.usuarioNombre,
      usuarioTipo: this.usuarioTipo,
    };
    let password = process.env.JWT_SECRET || "codigo4";
    // https://www.npmjs.com/package/jsonwebtoken
    // expiresIn : int, str => si yo le mando un entero lo tomara como segundos, '1h'
    let token = jwt.sign(
      payload,
      password,
      { expiresIn: 60 },
      { algorithm: "RS256" }
    );
    return token;
  };

  return usuario;
};
module.exports = usuario_model;
