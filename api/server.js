const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Asegúrate de importar cors
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'https://web-front-inky.vercel.app', // Asegúrate de que esta URL coincida con la de tu frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Aplica CORS al servidor
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Conectar a MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('Error: Mongo URI no está definida.');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API. Usa /api/register para registrarte y /api/login para iniciar sesión.');
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'El nombre de usuario o email ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son obligatorios' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    return res.status(200).json({ message: 'Inicio de sesión exitoso', username: user.username });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = app;