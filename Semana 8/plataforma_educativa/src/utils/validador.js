const jwt = require("jsonwebtoken");
const { Usuario } = require("../config/mongoose");
const verificarToken = (token)=>{
    try {
        let password = process.env.JWT_SECRET || 'mongoAPI'
        let paylod = jwt.verify(token, password, {algorithm:'RS256'});
        return paylod;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const wachiman = (req, res, next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1]; // Bearer 12390123.asdasd8.a8sd7a8sd
        const respuesta = verificarToken(token);
        if (respuesta){
            req.usuario = respuesta; // agrego a mi request un nuevo campo llamado usuario en el cual voy a almacenar todo su payload
            next();
        }else{
            // la token no es valida ó ya murió ó la password no es la correcta
            res.status(401).json({
                ok :false,
                content: null,
                message: 'No estas autorizado para realizar esta peticion'
            })
        }
    }else{
        return res.status(401).json({
            ok :false,
            message:'Necesitas estar autenticado para realizar esta peticion'
        })
    }
}

module.exports = {
    wachiman
}