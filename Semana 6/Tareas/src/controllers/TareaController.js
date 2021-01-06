// Aquí se va a definir todos los controladores (comportamiento que va a recibir cuando se llama a una ruta determinada con su metodo de acceso (get, post, put, delete))
let tareas = [
    {
        nombre: "Ir al gym",
        importancia: "Baja"
    }
];

const crearTarea = (req, res) => {
    // console.log(req.body);
    let tarea = req.body;
    // la forma de capturar lo que me manda el usuario mediante el body es por su request (req)
    tareas.push(tarea);
    return res.json({
        ok: true,
        content: tareas,
        message: 'Se agregó la tarea exitosamente'
    })
};

const listarTareas = (req, res) => {
    return res.json({
        ok: true,
        content: tareas,
        message: null
    })
};

const editarTareaPorId = (req, res) => {
    // para capturar un valor pasado por la url se usa su metodo params que nos retorna un diccionario de todas las variables decladas en la ruta.
    let { id_tarea } = req.params;
    // validar que la posicion mandada exista, si existe hace el cambio de la tarea y si no, indicar que la tarea no existe.
    console.log(tareas.length);
    if (tareas.length >= id_tarea) {
        //significa que la tarea existe
        tareas[id_tarea - 1] = req.body;
        return res.json({
            ok: true,
            message: 'Si existe la tarea',
            content: tareas[id_tarea - 1]
        })
    } else {
        // el id esta fuera de la longitud de mis tareas
        return res.status(404).json({
            ok: false,
            content: null,
            message: 'No existe esa tarea'
        })
    }
}

// eliminar una tarea segun su id
const eliminarTareaPorId = (req, res)=>{
    let {id_tarea} = req.params;
    if (tareas.length >= id_tarea){
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/splice
        tareas.splice(id_tarea-1 , 1);
        return res.json({
            ok :true,
            message:'Se elimino la tarea exitosamente',
            content: null
        });
    }else{
        return res.status(404).json({
            ok: false,
            message: 'No existe la tarea',
            content: null
        })
    }
}

const devolverTareaPorId = (req, res)=>{
    // validar si en los parametros esta el parametro id y si está buscarlo en el array y si no está el id indicar que falta ese parametro con un estado 500 y si no existe esa posicion indicar que no existe con un stado 404
    let {id} = req.query;
    if (id){
        // si el id es mayor que la longitud de mi arreglo Ó si el id es un valor negativo o igual a cero entonces es una posición invalida
        if(id > tareas.length || id <= 0){
            return res.status(404).json({
                ok: false,
                content: null,
                message: 'Posicion no encontrada'
            });
        }else{
            return res.json({
                ok: true,
                content: tareas[id-1],
                message: null
            });
        }
    }else {
        return res.status(500).json({
            ok: false,
            content: null,
            message: 'Falta el parametro id'
        })
    }
}

module.exports = {
    // gracias a ES6 se interpreta como creaTarea: crearTarea, es decir la llave del json es igual al nombre de la variable a exportar
    crearTarea,
    listarTareas,
    editarTareaPorId,
    eliminarTareaPorId,
    devolverTareaPorId
}