const {Curso} = require("../config/mongoose");

const crearCurso = async (req,res)=>{
    try {    
        let objCurso = new Curso(req.body);
        // aquí ira la logica de agrega la imagen
        let nuevoCurso = await objCurso.save();
        return res.status(201).json({
            ok: true,
            content: nuevoCurso,
            message:'Curso creado exitosamente'
        })
    } catch (error) {
        return res.status(500).json({
            ok:true,
            content: error,
            message: 'Error al crear el curso'
        })
    }
}

module.exports = {
    crearCurso
}