const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(bodyParser.json());
app.use(cors());


const users = [];


app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

 
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'El nombre de usuario ya existe' });
  }

 
  users.push({ username, email, password });
  console.log(users); 
  return res.status(200).json({ message: 'Usuario registrado exitosamente' });
});


app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son obligatorios' });
  }


  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }


  if (user.password !== password) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  return res.status(200).json({ message: 'Inicio de sesión exitoso' });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});