const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de que el modelo 'User' esté bien importado
const userController = require('../controllers/userController');
const router = express.Router();

// Ruta de bienvenida
router.get('/', (req, res) => {
  res.send('Bienvenido a la API. Usa /api/register para registrarte y /api/login para iniciar sesión.');
});

router.post('/login', userController.postLogin);
router.post('/register', userController.postRegistro);

app.use('/api', router);

module.exports = router;