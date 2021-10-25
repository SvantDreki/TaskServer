const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //Leer el token del header
    const token = req.header('x-auth-token');

    //Revisar si hay token
    if(!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido' });
    }

    //Validar token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        //Cifrado es el payload que se hizo en el usuarioController
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no Válido' });
    }
}