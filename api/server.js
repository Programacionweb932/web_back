const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes');  // Asegúrate de que la ruta a routes.js es correcta

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


router.get('/api', (req, res) => {
  res.send('Bienvenido al back del mundo de la tecnologia');
});

// Conectar a MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('Error: Mongo URI no está definida.');
  process.exit(1);
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });

// Usar las rutas definidas en routes.js
app.use('/api', router);  // Aquí estamos usando el enrutador para manejar todas las rutas

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;