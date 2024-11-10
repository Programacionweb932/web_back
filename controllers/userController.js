const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 


//                        Ruta de login
const postLogin = async (req, res) => {
    const { username, password } = req.body;
  
    // Verificar que se proporcionen usuario y contraseña
    if (!username || !password) {
      return res.status(400).json({ status: "Error", message: "Usuario y contraseña son requeridos." });
    }
  
    try {
      // Buscar el usuario en la base de datos
      const user = await pool.db('programacionweb').collection('users').findOne({ usuario });
  
      // Comprobar si el usuario existe
      if (!user) {
        return res.status(401).json({ status: "CredencialesIncorrectas", message: "Usuario o contraseña incorrectos" });
      }
  
      // Encriptar la contraseña proporcionada
      const hashedPassword = CryptoJS.SHA256(password).toString();
  
      // Comparar la contraseña encriptada
      if (user.psw !== hashedPassword) {
        return res.status(401).json({ status: "CredencialesIncorrectas", message: "Usuario o contraseña incorrectos" });
      }
  
      // Usuario autenticado exitosamente
      // Asegúrate de enviar el rol del usuario junto con la respuesta
      return res.json({
        status: "Bienvenido",
        user: usuario,
        role: user.role,  // Aquí se asegura que el rol es enviado
        _id: user._id
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ status: "Error", message: "Error interno del servidor" });
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