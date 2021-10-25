const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.crearUsuario = async (req, res) => {
    
    //Revisa si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //Crea un usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcrypt.genSaltSync(10);
        usuario.password = await bcrypt.hashSync(password, salt);

        //Guarda el usuario en la db
        await usuario.save();

        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000 // 1hora
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json({ token });
        });

        
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}