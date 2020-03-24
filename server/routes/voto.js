const express = require('express');
const router = express.Router();

const { verificaToken } = require('../middlewares/autenticacion');

const VotoController = require('../controllers/VotoController');

router.post('/voto', verificaToken, VotoController.crear);

module.exports = router;