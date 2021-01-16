const {Router} = require('express');
const producto_controller = require('../controllers/ProductoController');
const {wachiman} = require('../utils/Validador');

const producto_router = Router();

producto_router.post('/producto', producto_controller.crearProducto);
producto_router.get('/producto', wachiman, producto_controller.listarProducto);
module.exports = producto_router;