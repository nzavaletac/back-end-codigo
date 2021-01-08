const ProductoController = require('../controllers/ProductoController');
const {Router} = require('express');

module.exports = producto_router = Router();
producto_router.post('/producto',ProductoController.crearProducto);