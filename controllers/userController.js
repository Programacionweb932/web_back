const { ObjectId } = require('mongodb');
const pool = require('../mongo');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const Ticket = require('../models/ticket');
const Admin = require('../models/Admin');


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
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
  }

  try {
      // Verificamos si el nombre de usuario ya existe
      const userExists = await User.findOne({ username });
      if (userExists) {
          return res.status(400).json({ message: 'El nombre de usuario ya existe' });
      }

      // Hasheamos la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creamos un nuevo usuario con el rol 'user' (por defecto)
      const newUser = new User({
          username,
          password: hashedPassword,
          role: 'user',  // Asignamos el rol 'user' por defecto
      });

      // Guardamos el nuevo usuario en la colección users
      await newUser.save();

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ error: 'Error en el servidor al registrar el usuario' });
  }
};

  //            Registro Administrador

  const postRegistroAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
    }

    try {
        // Verificamos si el nombre de usuario ya existe
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }

        // Hasheamos la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos un nuevo usuario con el rol 'admin'
        const newAdmin = new User({
            username,
            password: hashedPassword,
            role: 'admin',  // Asignamos el rol 'admin'
        });

        // Guardamos el nuevo administrador en la colección users
        await newAdmin.save();

        res.status(201).json({ message: 'Administrador registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el administrador:', error);
        res.status(500).json({ error: 'Error en el servidor al registrar el administrador' });
    }
};



  //               Creacion de Ticket usuario
  const postTicket = async (req, res) => {
    const { description, subject, email, name } = req.body;
  
    try {
      // Buscar al usuario en la base de datos por su email
      const user = await User.findOne({ email });
      
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