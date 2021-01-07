const { Producto } = require('../config/Sequelize');

const crearProducto = (req, res) => {
    return res.status(201).json({
        ok: true
    })
};
module.exports = {
    crearProducto
}