const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usurio');
const { generarJWT } = require('../helpers/jwt');


const login = async( req, res = response) =>{

    const { email, password } = req.body;

    try {

        // Verificar Email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // vErificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        // Generar el Token - JWT
        const token = await generarJWT( usuarioDB.id );

        
        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

module.exports = {
    login
}