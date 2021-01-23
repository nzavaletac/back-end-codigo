const { Schema } = require("mongoose");
const imagenSchema = require("./imagen");
// * https://www.npmjs.com/package/bcrypt
const bcrypt = require("bcrypt");
// en bd no relacionales las tablas pasan a llamarse colecciones y dentro de mongoose se denomina Schema
const fonoUsuarioSchema = new Schema({
    fono_codigo: {
        type: Number,
        min: 1,
        max: 99
    },
    fono_numero: {
        type:String,
        minlength: 6,
        maxlength: 9
    }
},{_id: false});

const usuarioSchema = new Schema({
    usuario_nombre: {
        type: String,
        required: true,
        alias:'usu_nomb'
    },
    usuario_apellido: {
        type: String,
        maxlength: 25
    },
    usuario_email:{
        type: String,
        maxlength: 50,
        required: true,
    },
    usuario_hash: String,
    usuario_categoria: {
        type: Number,
        min: 1,
        max: 4
    },
    usuario_telefono : [
        fonoUsuarioSchema
    ],
    usuario_imagen: imagenSchema,
    cursos: [String],
    comentarios: [Schema.Types.String]
    // String, Number, Date, Buffet, Boolean, Mixed, ObjectId, Array, Decimal128, Map, Schema
}, {timestamps: true});

usuarioSchema.methods.encriptarPassword = async function (password) {
    // Por si queremos guardar el salt o generar uno previamente:
    // bcrypt.genSalt(10)
    await bcrypt.hash(password,10
        /*
        ,(error,pwdEncripted)=>{
        this.usuario_hash = pwdEncripted;
        console.log(error);
    }
    */
    ).then((pwdEncripted)=>{
        console.log(pwdEncripted);
        this.usuario_hash = pwdEncripted
    }).catch((error)=>{
        console.log(error);
    })
}

module.exports = usuarioSchema;