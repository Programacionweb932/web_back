const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de que el modelo 'User' esté bien importado
const Ticket = require('../models/ticket');
const Admin = require('../models/Admin');
const Agenda = require('../models/agenda');
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
router.post('/agenda', userController.postAgenda);
router.get('/agenda/hours', userController.getHorasDisponibles);
router.post('/tickets/history', userController.fetchHistorialTicket);
router.post('/token', userController.verifyToken);


module.exports = router;