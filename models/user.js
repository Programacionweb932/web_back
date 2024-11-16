const mongoose = require('mongoose');

// Esquema para los usuarios
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // Asegura que el nombre de usuario sea único
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],  // Los roles posibles son admin o user
        default: 'user',  // El rol por defecto es 'user', pero se puede cambiar a 'admin'
    },
}, {
    timestamps: true, // Esto genera createdAt y updatedAt automáticamente
});

// Crear el modelo de User
const User = mongoose.model('User', userSchema);

module.exports = User;
