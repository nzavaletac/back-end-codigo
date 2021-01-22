const {Schema}= require("mongoose");

const direccionSchema = new Schema({
    direccion_tipo: {
        type: String, // define el tipo, es el unico campo OBLIGATORIO al definir una columna
        uppercase: true, // todo el texto ingresado se convierte en mayus
        maxlength: 50 // longitud maxima, lo convertiría como un VARCHAR
    },
    direccion_descripcion:{
        type: String,
        minlength: 10,
        maxlength: 60,
        required: true
    }
},{_id:false})

module.exports = direccionSchema;