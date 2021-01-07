const {DataTypes} = require('sequelize');
const tipo_operacion_model = (conexion)=>{
    let tipo_operacion = conexion.define('tipo_operaciones',{
        tipoOperacionId : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'tipo_ope_id',
            allowNull: false,
            autoIncrement: true
        },
        // hacer la descripcion y que solamente admita valores alfabeticos y que no pueda ser null y sea unico.
        tipoOperacionDescripcion: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'tipo_ope_desc',
            unique: true,
            validate: {
                isAlpha: true,
                notNull: true
            }
        }
    }, {
        tableName : 't_tipo_ope',
        timestamps: true,
        createdAt : 'fecha_creacion',
        updatedAt : 'fecha_actualizacion'
        // si quiero que no se cree alguno de los dos campos de auditoria simplemente le pongo su valor de false
        // si quiero sobre-escribir su nombre de columna le pongo su nuevo nombre como valor
        // si no quiero ninguno de los dos timestamps:false (es su valor por defecto)
    });
    return tipo_operacion;
};
module.exports = tipo_operacion_model;