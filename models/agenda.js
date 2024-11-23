const mongoose = require('mongoose');

// Definir el esquema de la agenda
const agendaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo de usuario
    required: true,
  },
  hora: {
    type: String,
    required: true, // Hora de la cita (en formato HH:MM)
  },
  date: {
    type: String,
    required: true, // Fecha de la cita (en formato YYYY-MM-DD)
  },
  email: {
    type: String,
    required: true, // Email del usuario
  },
  name: {
    type: String,
    required: true, // Nombre del usuario
  },
  tipoServicio: {
    type: String,
    required: true,

  },
  status: {
    type: String,
    enum: ['reservada', 'cancelada', 'completada'],
    default: 'reservada', // Estado de la cita, por defecto 'reservada'
  },
});

// Crear y exportar el modelo de la agenda
const Agenda = mongoose.model('Agenda', agendaSchema);

module.exports = Agenda;
