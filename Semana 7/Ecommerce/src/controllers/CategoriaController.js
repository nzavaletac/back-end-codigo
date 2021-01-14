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
module.exports = {
    createCategoria,
    devolverCategorias
}