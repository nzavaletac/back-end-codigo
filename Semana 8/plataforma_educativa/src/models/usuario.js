const { Schema } = require("mongoose");
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
    usuario_salt: String,
    usuario_categoria: Number,
    usuario_telefono : [
        fonoUsuarioSchema
    ]
    // String, Number, Date, Buffet, Boolean, Mixed, ObjectId, Array, Decimal128, Map, Schema
}, {timestamps: true});

module.exports = usuarioSchema;