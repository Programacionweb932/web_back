const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();


//                        Ruta de login
const postLogin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Buscar el usuario en la base de datos
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }
  
      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
  
      // Generar un token JWT
      const token = jwt.sign({ userId: user._id }, 'secretoDelToken', { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
  };


//                        Ruta de registro
const postRegistro = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const userExists = await User.findOne({ $or: [{ username }, { email }] });
      if (userExists) {
        return res.status(400).json({ message: 'El nombre de usuario o correo electrónico ya existe' });
      }
  
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear un nuevo usuario
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ error: 'Error en el servidor al registrar el usuario' });
    }
  };

  module.exports ={

    postLogin,
    postRegistro
  }