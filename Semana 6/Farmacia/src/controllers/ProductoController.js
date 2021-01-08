const { Producto } = require('../config/Sequelize');

const crearProducto = async (req, res) => {
    let cuerpo = req.body;
    // toda manipulacion con Sequelieze nos retorna una promesa.
    // la forma mas directa de crear un registro en la bd es mediante el metodo create en el cual se tiene que mandar un JSON con todos los campos requeridos de dicho modelo. 
    // 2 formas de trabajar promesas, la primera es usando .then().catch()
    // la segunda forma es usando un palabra llamada await (va a esperar al resultado de esa promesa), lo mas recomendable es usarlo con un try - catch, y obligatoriamente al usar el await en su funcion mas proxima se debe de declara que va a ser una funcion asincrona (async)
    try {
        let nuevoProducto = await Producto.create(cuerpo);
        console.log(nuevoProducto);
        return res.json({
            ok: true,
            content: nuevoProducto
        });
    } catch (error) {
        console.error(error);
        return res.json({
            ok:false,
            content: error
        })
    }
};
module.exports = {
    crearProducto
}