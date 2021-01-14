const {Router} = require('express');
const CategoriaController = require('../controllers/CategoriaController');
const categoria_router = Router();

categoria_router.post('/categoria', CategoriaController.createCategoria);
categoria_router.get('/categoria', CategoriaController.devolverCategorias);

module.exports = categoria_router;