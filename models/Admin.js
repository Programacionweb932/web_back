const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definición del esquema para el administrador
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
        enum: ['admin', 'user'],
        default: 'user',
    },
    email: {
        type: String,
        required: false, // Elimina el requerimiento para email
        unique: false,   // Elimina el índice único en email
    }
});

// Pre-save hook para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();  // Si la contraseña no se ha modificado, no se encripta
    try {
        const salt = await bcrypt.genSalt(10);  // Generar un salt
        this.password = await bcrypt.hash(this.password, salt);  // Encriptar la contraseña
        next();
    } catch (error) {
        next(error);  // Si hay algún error, pasarlo al siguiente middleware
    }
});

// Método para verificar la contraseña durante el login
userSchema.methods.isPasswordValid = async function(password) {
    return bcrypt.compare(password, this.password);  // Compara la contraseña proporcionada con la almacenada
};

// Exportamos el modelo basado en el esquema
const Admin = mongoose.model('Admin', userSchema);

module.exports = Admin;