const { Producto } = require("../config/Sequelize");

const crearProducto = (req, res) => {
  Producto.create(req.body).then((productoCreado) => {
    return res.status(201).json({
      ok: true,
      content: productoCreado,
      message: "Producto creado exitosamente",
    });
  }).catch(error=>res.status(500).json({
      ok: false,
      content: error,
      message:'Hubo un error al crear el producto'
  }));
};

const listarProducto = (req,res)=>{
  console.log('estoy dentro de listar producto');
  console.log(req.usuario);
  Producto.findAll().then(productos=>res.json({
    ok:true,
    content: productos,
    message: null
  }))
}

module.exports = {
  crearProducto,
  listarProducto,
};
