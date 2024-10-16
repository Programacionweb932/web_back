const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
//const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Simulación de base de datos
const users = [];

// Ruta de registro de usuarios
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar si el usuario ya existe
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'El nombre de usuario ya existe' });
  }

  // Guardar el usuario
  users.push({ username, email, password });
  console.log(users); // Verificación de que los usuarios se están registrando correctamente
  return res.status(200).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta de inicio de sesión (login)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son obligatorios' });
  }

  // Buscar el usuario por el nombre de usuario
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Verificar la contraseña
  if (user.password !== password) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  return res.status(200).json({ message: 'Inicio de sesión exitoso' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en https://web-back-nu.vercel.app`);
});