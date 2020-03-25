const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VotoSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    votado: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El usuario es necesario'] },
    votos: [ Object ],
    fecha_votacion: { type: Date }
});

module.exports = mongoose.model('Voto', VotoSchema);