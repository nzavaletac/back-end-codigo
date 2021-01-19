const { Producto, Categoria } = require("../config/Sequelize");

const crearProducto = (req, res) => {
  let producto;
  Producto.create(req.body).then((productoCreado) => {
    /*
    * Antes de hacer el cambio con la validacion de la categoria
    */
    /*
    return res.status(201).json({
      ok: true,
      content: productoCreado,
      message: "Producto creado exitosamente",
    });
    */
    producto = productoCreado;
    return Categoria.findByPk(productoCreado.categoria_id);
  }).then((categoriaEncontrada)=>{
    if(categoriaEncontrada.categoriaEstado===false){
      return res.status(201).json({
        ok: true,
        content: producto,
        message: "Se creo el producto pero no se va a mostrar porque la categoria no esta activa",
      });
    }else{
      return res.status(201).json({
        ok: true,
        content: producto,
        message: "Producto creado exitosamente",
      });
    }
  })
  .catch(error=>res.status(500).json({
      ok: false,
      content: error,
      message:'Hubo un error al crear el producto'
  }));
};

const listarProducto = (req,res)=>{
  // console.log('estoy dentro de listar producto');
  // console.log(req.usuario);
  Producto.findAll({
    include:{
      model: Categoria,
      where:{
        categoriaEstado : true
      },
      attributes:[]
    }
  }).then(productos=>res.json({
    ok:true,
    content: productos,
    message: null
  }))
}

module.exports = {
  crearProducto,
  listarProducto,
};
