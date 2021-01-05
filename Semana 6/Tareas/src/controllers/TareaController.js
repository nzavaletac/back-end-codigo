// Aquí se va a definir todos los controladores (comportamiento que va a recibir cuando se llama a una ruta determinada con su metodo de acceso (get, post, put, delete))
let tareas = [];

const crearTarea = (req, res)=>{
    return res.json({
        ok: true,
        message: 'Se agregó la tarea exitosamente'
    })
}  

module.exports = {
    // gracias a ES6 se interpreta como creaTarea: crearTarea, es decir la llave del json es igual al nombre de la variable a exportar
    crearTarea, 
}