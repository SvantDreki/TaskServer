const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req, res) => {

    //Revisa si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraer el email y password
    const { email, password } = req.body;

    try {
        //Revisar que sea el usuario registrado
        let usuario = await Usuario.findOne({ email });

        if(!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        //Revisa el password
        const passCorrecto = await bcrypt.compareSync(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({ msg: 'Password Incorrecto' });
        }

        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1hora
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json({ token });
        }); 

    } catch (error) {
        console.log(error);
    }

}

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
}