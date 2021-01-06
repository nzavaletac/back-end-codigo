// los dataTypes sirven para indicar que valor va a recibir cierta columna
// https://sequelize.org/master/manual/model-basics.html#data-types
const {DataTypes} = require('sequelize');
const producto_model = (conexion)=>{
    let producto = conexion.define('productos',{
        // aca van todas nuestras columnas
        productoId: {
            // https://sequelize.org/master/manual/model-basics.html#column-options
            primaryKey: true, // sirve para indicar cual va a ser la pk
            autoIncrement : true, // para mysql y mariaDb al momento de poner que es pk automaticamente es autoincrementable, no es necesario especificar
            type: DataTypes.INTEGER,
            field: 'prod_id',
            allowNull: false
        },
        productoNombre: {
            // si no pongo la longitud en los STRING va a ser de longitud 1, va a crear un VARCHAR(1)
            type: DataTypes.STRING(45),
            field: 'prod_nomb',
            unique: true
        },
        productoPrecio: {
            type: DataTypes.DECIMAL(5,2),
            field: 'prod_precio'
        },
        productoRegistroSanitario:{
            type: DataTypes.STRING(25),
            field: 'prod_regsan'
        }
    },{
        tableName: 't_producto',
        timestamps: true
    });
    return producto;
}

module.exports = producto_model;