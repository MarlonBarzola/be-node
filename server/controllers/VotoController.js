const libs = require('../helpers/libs');

const Voto = require('../models/Voto');
const ctrl = {};

ctrl.crear = ( req, res ) => {

    let body = req.body;

    if(req.usuario._id === body.votado) {
        
        return res.json({
            ok: false,
            mensaje: 'No puede realizar votos para usted mismo'
        });

    }

    let votos = body.votos;
    
    let uniqs = libs.removeDuplicates(votos, "categoria");
    
    if(votos.length != uniqs.length) {

        return res.status(404).json({
            ok: false,
            mensaje: 'No se puede realizar más de un voto por categoría'
        });

    }

    let votosReq = body.votos;
    let arrayVotosReq = [];

    votosReq.forEach(element => {
        arrayVotosReq.push(element.categoria);
    });
    //, {
    Voto.find({ usuario: req.usuario._id, votado: body.votado, "votos.categoria": {"$in": arrayVotosReq} }, (err, votosDB) => {
        
        if(votosDB.length > 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se pueden repetir votos',
            });
        }
        
        const voto = new Voto({
            usuario: req.usuario._id,
            votado: body.votado,
            votos: votosReq
        });
    
        voto.save((err, votoDB) => {
    
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            res.json({
                ok: true,
                voto: votoDB
            });
    
        }); 

    }); 

}

module.exports = ctrl;