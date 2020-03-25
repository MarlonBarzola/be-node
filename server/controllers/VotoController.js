const libs = require('../helpers/libs');

const Votos = require('../models/Voto');
const Usuarios = require('../models/Usuario');

const ctrl = {};

//
// ─── CREACION DE VOTOS ──────────────────────────────────────────────────────────
//

ctrl.crear = ( req, res ) => {

    let body = req.body;

    if(req.usuario._id === body.votado) 
        return res.status(404).json({ mensaje: 'No puede realizar votos para usted mismo'});

    let votos = body.votos;
    
    let uniqs = libs.removeDuplicates(votos, "categoria");
    
    if(votos.length != uniqs.length) 
        return res.status(404).json({ mensaje: 'No se puede realizar más de un voto por categoría'});

    let votosReq = body.votos;
    let arrayVotosReq = [];

    votosReq.forEach(element => {
        arrayVotosReq.push(element.categoria);
    });

    Votos.find({ usuario: req.usuario._id, votado: body.votado, "votos.categoria": {"$in": arrayVotosReq} }, 
    (err, votosDB) => {
        
        if(votosDB.length > 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se pueden repetir votos',
            });
        }

        saveVoto(req, res, body);

    }); 

}

let saveVoto = (req, res, body) => {

    const voto = new Votos({
        usuario: req.usuario._id,
        votado: body.votado,
        votos:  body.votos,
        fecha_votacion: new Date()
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
}

//
// ─── VER MAS VOTADOS POR MES ────────────────────────────────────────────────────
//

ctrl.votosPorMes = (req, res) => {

    let mes = req.params.mes;
    let year = req.params.year;

    let start = `${ year }-${ mes }-01T00:00:00Z`;
    let end = `${ year }-${ mes }-31T00:00:00Z`;

    Votos.aggregate(
        [
            { $match: {"fecha_votacion": { "$gte": new Date(start), "$lte": new Date(end) }}},
            { $group: {_id : "$votado", count:{ $sum:1 }} },    
        ],
        (err, usuariosDB) => {

            if(err) return res.status(500).json({err});

            if(usuariosDB.length === 0) return res.status(404).json({ mensaje: 'No se encontraron registros' });

            usuariosDB.sort((obj1, obj2) => obj1.count - obj2.count);
            let usuarioMasVotado = usuariosDB.pop();
            let _id = usuarioMasVotado._id;

            Usuarios.findById({ _id }, (err, usuario) => {
                
                if (err) return res.status(400).json({ err});
        
                res.json({
                    ok: true,
                    usuario,
                    votosTotales: usuarioMasVotado.count
                });

            });

        }
    ); 

}

//
// ─── USUARIOS MAS VOTADOS POR AREA ──────────────────────────────────────────────
//

ctrl.votosPorArea = (req, res) => {

    Votos.aggregate(
        [
            { $group: {_id : {"votado": "$votado", "votante": "$usuario", "categorias": "$votos.categoria"}, count: {$sum: 1} }},
            { $sort: {count: -1} }
        ],
        (err, data) => {

            Usuarios.populate(data, {path: '_id.votado'}, (err, usuarios) => {

                if (err) return res.status(400).json({ err });

                if(usuarios.length === 0) return res.status(404).json({mensaje: 'No hay registros'});

                return res.json({
                    ok: true,
                    usuarios
                });
            });
           
        }
    )

}

module.exports = ctrl;