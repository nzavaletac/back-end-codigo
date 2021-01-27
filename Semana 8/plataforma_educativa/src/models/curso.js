const {Schema}= require("mongoose");
const imagenSchema = require("./imagen");
// npm i moment-timezone
const moment = require("moment-timezone");
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const horaPeruana = moment.tz(Date.now(),'America/Lima');
// TODO
// * Agregar el contenido del curso
// * Agregar el costo del curso
// Schema.Types.
const contenidoSchema = new Schema({
    video_url:{
        type: String,
        required: true
    },
    video_orden: {
        type: Number,
        required: true
    },
    video_nombre: {
        type: String,
        maxlength: 100
    }
},{_id: false});

const cursoSchema = new Schema({
    curso_nombre : {
        type : String,
        unique: true,
        required: true,
        uppercase: true,
        maxlength: 50
    },
    // curso_descripcion : String
    curso_descripcion:{
        type: String
    },
    curso_link : String,
    curso_fecha_lanzamiento: {
        type: Date,
        min:'2021-01-01',
        max:'2021-12-31',
        default: horaPeruana
    },
    curso_imagenes: [imagenSchema],
    usuarios: [Schema.Types.ObjectId],
    comentarios: [Schema.Types.ObjectId],
    // si el padre no le indicamos que sea required, pero a los hijos si les indicamos, no va a respetar esa normativa
    curso_videos: {
        type: [contenidoSchema],
        required: true
    },
    
    curso_costo: {
        type: Number,
        min: 0
    },
    curso_duracion: String,
    curso_publicado : {
        type: Boolean,
        default: false
    }
});

module.exports = cursoSchema;