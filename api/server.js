const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes');  // Asegúrate de que la ruta a routes.js es correcta

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Usar el enrutador para todas las rutas que comienzan con /api
app.use('/api', router);



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

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;