const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const CategoriaSchema = new Schema({

    categoria: { type: String, unique: true , required: [true, 'El nombre de la categoría es necesario'] },

});

CategoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model('Categoria', CategoriaSchema);