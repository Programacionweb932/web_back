const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Asegúrate de que el modelo no se defina más de una vez
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;