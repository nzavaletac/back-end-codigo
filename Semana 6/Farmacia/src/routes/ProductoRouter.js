const ProductoController = require('../controllers/ProductoController');
const {Router} = require('express');

module.exports = producto_router = Router();
producto_router.post('/producto',ProductoController.crearProducto);
producto_router.get('/producto',ProductoController.listarProductos);
producto_router.get('/producto/:id', ProductoController.listarProductoById);