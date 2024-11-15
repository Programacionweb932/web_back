const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    minlength: 8 // Validación de longitud mínima de la contraseña
  },
  role: { type: String, default: 'admin' },  // El rol predeterminado es 'admin'
});

// Hook para encriptar la contraseña antes de guardarla
adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar la contraseña
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;