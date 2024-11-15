const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de que el modelo 'User' esté bien importado
const Ticket = require('../models/ticket');
const userController = require('../controllers/userController');
const router = express.Router();

// Ruta de bienvenida
router.get('/', (req, res) => {
  res.send('Bienvenido al back del mundo de la tecnologia');
});

// Rutas para login y registro
router.post('/login', userController.postLogin);
router.post('/register', userController.postRegistro);
router.post('/Adminregister', userController.postRegistroAdmin);
router.post('/ticket', userController.postTicket);



module.exports = router;