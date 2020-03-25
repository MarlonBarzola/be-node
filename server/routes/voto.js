const express = require('express');
const router = express.Router();

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const VotoController = require('../controllers/VotoController');

router.get('/voto/:year/:mes', [verificaToken, verificaAdminRole], VotoController.votosPorMes);
router.get('/voto', [ verificaToken, verificaAdminRole ], VotoController.votosPorArea);
router.post('/voto', verificaToken, VotoController.crear);

module.exports = router;