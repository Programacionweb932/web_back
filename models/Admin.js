const mongoose = require('mongoose');

// Definición del esquema para el administrador
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,  // El nombre de usuario es obligatorio
        unique: true,    // Asegura que no haya dos administradores con el mismo nombre de usuario
        minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'], // Validación mínima
        maxlength: [30, 'El nombre de usuario debe tener un máximo de 30 caracteres'], // Validación máxima
    },
    password: {
        type: String,
        required: true,  // La contraseña es obligatoria
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],  // Validación mínima de longitud
    },
    role: {
        type: String,
        enum: ['admin', 'user'],  // Solo puede ser 'admin' o 'user'
        default: 'admin',         // Si no se especifica, se asigna el rol 'admin'
    },
}, {
    timestamps: true, // Agrega automáticamente los campos 'createdAt' y 'updatedAt'
});

// Exportamos el modelo basado en el esquema
const Admin = mongoose.model('Admin', userSchema);

module.exports = Admin;