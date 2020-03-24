const express = require('express');
const router = express.Router();

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let CategoriaController = require('../controllers/CategoriaController');

router.get('/categoria', verificaToken, CategoriaController.index);
router.post('/categoria', verificaToken , CategoriaController.crear);

module.exports = router;