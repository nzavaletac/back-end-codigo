// se puede usar destructuracion para importar algo cuando queremos usar una parte de una libreria o archivo
const { Router } = require('express');
// importar el crearTarea por destructuracion
const { crearTarea, listarTareas, editarTareaPorId, eliminarTareaPorId, devolverTareaPorId } = require('../controllers/TareaController');
// const tareaController = require('../controllers/TareaController');

const tarea_router = Router();

tarea_router.post('/tarea', crearTarea );
tarea_router.get('/tarea', listarTareas);
tarea_router.put('/tarea/:id_tarea', editarTareaPorId);
tarea_router.delete('/tarea/:id_tarea', eliminarTareaPorId );
tarea_router.get('/tarea/filter', devolverTareaPorId);

module.exports = tarea_router; // esta es una exportacion por defecto (export default tarea_router)