const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuarios = require('../models/Usuario');

const ctrl = {};


//
// ─── MOSTRAR TOTAL DE USUARIOS REGISTRADOS ──────────────────────────────────────
//

ctrl.index = (req, res) => {

    Usuarios.find({}, (err, usuarios) => {

        if( err ) return res.status(500).json({ err });

        Usuarios.countDocuments({}, (err, conteo) => {

            if( err ) return res.status(500).json({ err });
    
            res.json({
                ok: true,
                usuarios,
                registrados: conteo 
            });
    
        });

    });

}
    

//
// ─── CREAR USUARIO ──────────────────────────────────────────────────────────────
//

ctrl.crear = async (req, res) => {

    let body = req.body;

    let usuario = new Usuarios({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    await usuario.save((err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

}

//
// ─── LOGIN ──────────────────────────────────────────────────────────────────────
//

ctrl.login = async (req, res) => {

    let body = req.body;

    await Usuarios.findOne({ email: body.email }, (err, usuarioDB) => {

        if(err){

            return res.status(500).json({
                ok: false,
                err
            });

        } 

        if(!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });

        }

        if( !bcrypt.compareSync(body.password, usuarioDB.password) ){

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });

        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

}

module.exports = ctrl;

