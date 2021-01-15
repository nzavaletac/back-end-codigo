const { Categoria } = require('../config/Sequelize');

// creacion de categoria
const createCategoria = async (req, res) => {
    try {
        // si quiero usar el save primero tengo que construir (build)
        let nuevaCategoria = await Categoria.create(req.body);
        return res.status(201).json({
            ok: true,
            content: nuevaCategoria,
            message: 'Categoria creada exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            content: error,
            message: 'Hubo un error al crear la categoria'
        });
    }
}
const devolverCategorias = (req, res)=>{
    Categoria.findAll().then((categorias)=>{
        if (categorias.length != 0){
            return res.json({
                ok: true,
                content: categorias,
                message: null
            })
        }else{
            return res.status(404).json({
                ok: false,
                content: null,
                message:'Falta crear las categorias'
            })
        }
    }).catch((error)=>{
        return res.status(500).json({
            ok: false,
            content: error,
            message: 'Hubo un error al devolver las categorias'
        })
    })
    // segundo metodo, va con async obligatoriamente
    // let categorias = await Categoria.findAll()
}
const in_habilitarCategoria = async(req, res)=>{
    // mandar el id por la url y ver si la categoria tiene su estado=true, inhabilitarlo y si tiene que estado = false, habilitarlo, indicar en el message si fue habilitado o inhabilitado usando operadores ternarios y si no existe la categoria indicar que no existe con un estado 404
    // use update 
    let {id}= req.params;
    try {
        let categoriaEncontrada = await Categoria.findByPk(id);
        //console.log(categoriaEncontrada); // si no existe es null
        if(categoriaEncontrada){
            await Categoria.update({categoriaEstado: !categoriaEncontrada.categoriaEstado},{
                where: {
                    categoriaId:id
                }
            });
            let categoriaActualizada = await Categoria.findByPk(id);
            res.status(201).json({
                ok:true,
                content: categoriaActualizada.categoriaEstado?'Se habilito exitosamente':'Se inhabilito exitosamente',
                message:'Categoria actualizada exitosamente'
            })
        }else{
            res.status(404).json({
                ok:false,
                message:'Categoria no existe'
            })
        }
    } catch (error) {
        res.status(500).json({
            ok: false,
            content: error,
            message: 'Hubo un error al actualizar la categoria'
        })
    }
    /*
    Categoria.findByPk(id).then((categoriaEncontrada)=>{
        if(categoriaEncontrada){
            return Categoria.update({categoriaEstado: !categoriaEncontrada.categoriaEstado},{
                where: {
                    categoriaId:id
                }
            })
        }else{
            res.status(404).json({
                ok:false,
                message:'Categoria no existe'
            })
        }
    }).then(()=>{
        return Categoria.findByPk(id);
    }).then(categoriaActualizada=>{
        res.status(201).json({
            ok:true,
            content: categoriaActualizada.categoriaEstado?'Se habilito exitosamente':'Se inhabilito exitosamente',
            message:'Categoria actualizada exitosamente'
        })
    }).catch(error=>res.status(500).json({
        ok: false,
        content: error,
        message:'Error al actualizar la categoria'
    }))
    */
}
module.exports = {
    createCategoria,
    devolverCategorias,
    in_habilitarCategoria
}