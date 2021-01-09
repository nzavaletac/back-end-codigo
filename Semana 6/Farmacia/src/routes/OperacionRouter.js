const { Router } = require('express');
const OperacionController = require('../controllers/OperacionController');
const operacion_router = Router();

operacion_router.post('/operacion', OperacionController.crearOperacion);
operacion_router.get('/operaciones', OperacionController.listarOperaciones);
operacion_router.get('/operaciones/buscar', OperacionController.filtroOperaciones);

module.exports = operacion_router;