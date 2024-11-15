const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }  // Uso correcto de enum
});

// Asegúrate de que el modelo no se defina más de una vez
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;