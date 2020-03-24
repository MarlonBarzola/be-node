const express = require('express');
const router = express.Router();

//const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const UsuarioController = require('../controllers/UsuarioController');

router.post('/usuario', UsuarioController.crear);
router.post('/login', UsuarioController.login);
    

module.exports = router;