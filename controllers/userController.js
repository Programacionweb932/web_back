const { ObjectId } = require('mongodb');
const pool = require('../mongo');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const Ticket = require('../models/ticket');


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


  //            Registro Administrador
  const postRegistroAdmin = async (req, res) => {
    const { usuario, contraseña } = req.body;
  
    // Validar que se hayan proporcionado usuario y contraseña
    if (!usuario || !contraseña) {
      return res.status(400).json({ status: "Error", message: "Usuario y contraseña son requeridos." });
    }
  
    const hashedPassword = CryptoJS.SHA256(contraseña).toString(); // Encriptar la contraseña correctamente
    console.log("Hashed Password during Registration:", hashedPassword);
  
    try {
      // Verificar si el usuario ya existe
      const userExists = await pool.db('programacionweb').collection('users').findOne({ usuario: usuario });
      if (userExists) {
        return res.status(400).json({ status: "UsuarioYaExiste", message: "El usuario ya existe" });
      }
  
      // Insertar el nuevo usuario en la colección users
      const newUser = {
        usuario: usuario,
        psw: hashedPassword,
        role: 'Admin', // Asignar un rol por defecto
      };
  
      const userResult = await pool.db('programacionweb').collection('users').insertOne(newUser);
      const userId = userResult.insertedId; // Obtener el ID del usuario insertado
  
      // Insertar información adicional del usuario en la colección user_info
      const userInfo = {
        user_id: userId,
      };
  
      await pool.db('programacionweb').collection('user_info').insertOne(userInfo);
  
      res.status(201).json({ status: "UsuarioRegistrado", user: usuario, role: newUser.role });
    } catch (error) {
      console.error('Error registrando usuario:', error);
      res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
  };


  //               Creacion de Ticket usuario
  const postTicket = async (req, res) => {
    const { description, subject, email, name } = req.body;
  
    try {
      // Buscar al usuario en la base de datos por su email
      const user = await User.findOne({ name });
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Crear el ticket con el userId extraído del usuario
      const newTicket = new Ticket({
        userId: user._id,  // Asigna el _id del usuario
        description,
        subject,
        email,
        name,
        status: 'Pendiente', // Estado inicial del ticket
        response: '', // Inicialmente sin respuesta
        date: new Date(),
      });
  
      // Guardar el ticket en la base de datos
      await newTicket.save();
  
      res.status(201).json({ message: 'Ticket generado exitosamente', ticket: newTicket });
    } catch (error) {
      console.error('Error al generar el ticket:', error);
      res.status(500).json({ error: 'Error en el servidor al generar el ticket' });
    }
  };


  module.exports = {

    postLogin,
    postRegistro,
    postRegistroAdmin,
    postTicket
  }