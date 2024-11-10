const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 


//                        Ruta de login
const postLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Request received for login:', { username, password });
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: 'Usuario no encontrado' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Contraseña incorrecta' });
      }
  
      const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error('Error in login:', err);
      res.status(500).json({ msg: 'Error del servidor' });
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