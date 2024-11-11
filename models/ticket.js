// En el modelo Ticket
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: String,
  subject: String,
  email: String,
  name: String,
  ticketNumber: {
    type: Number,
    unique: true,
    default: () => Date.now() // Genera un valor único usando la fecha actual
  },
  status: {
    type: String,
    default: 'Pendiente'
  },
  response: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
