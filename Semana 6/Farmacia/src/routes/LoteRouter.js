const {Router} = require('express');
const LoteController = require('../controllers/LoteController');
// const {crearLote} = require('../controllers/LoteController');
const lote_router = Router();

lote_router.post('/lote', LoteController.crearLote);
lote_router.get('/lote/buscar',LoteController.buscarLote);

module.exports = lote_router;