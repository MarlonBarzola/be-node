const Categoria = require('../models/Categoria');

const ctrl = {};

//
// ─── MOSTRAR TODAS LAS CATEGORIAS ───────────────────────────────────────────────
//

ctrl.index = (req, res) => { 

    Categoria.find({}).sort('categoria')
    .exec((err, categorias) => {

        if(err) {
            
            return res.status(400).json({
                ok: false,
                err
            });
    
        }
    
        Categoria.countDocuments((err, conteo) => {

            res.json({
                ok: true,
                categorias,
                total: conteo 
            });

        });

    }); 

}

//
// ─── CREAR NUEVA CATEGORIA ──────────────────────────────────────────────────────
//

ctrl.crear = (req, res) => {

    let categoria = new Categoria({
        categoria: req.body.categoria,
    });

    categoria.save( (err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

}

module.exports = ctrl;