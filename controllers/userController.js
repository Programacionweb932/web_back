const { ObjectId } = require('mongodb');
const pool = require('../mongo');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const Ticket = require('../models/ticket');
const Admin = require('../models/Admin');
const Agenda = require('../models/agenda');


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

  if (!username || !password || !email) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
  }

  try {
      // Verificamos si el nombre de usuario ya existe
      const userExists = await User.findOne({ email });
      if (userExists) {
          return res.status(400).json({ message: 'El nombre de usuario ya existe' });
      }

      // Hasheamos la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creamos un nuevo usuario con el rol 'user' (por defecto)
      const newUser = new User({
          username,
          email,
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
        const userExists = await Admin.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }

        // Hasheamos la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos un nuevo administrador con el rol 'admin'
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            role: 'admin',  // Asignamos el rol 'admin'
        });

        // Guardamos el nuevo administrador en la colección users
        await newAdmin.save();

        res.status(201).json({ message: 'Administrador registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el administrador:', error);
        res.status(500).json({ error: `Error al registrar el administrador: ${error.message}` });
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

//               Creacion de cita usuario
const postAgenda = async (req, res) => {
  const { hora, date, email, name } = req.body;

  // Función para validar que la hora esté entre las 8:00 AM y las 4:30 PM
  const isValidTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    // Rango válido: de 8:00 AM (480 minutos) a 4:30 PM (990 minutos)
    return totalMinutes >= 480 && totalMinutes <= 990;
  };

  try {
    // Verificar si la hora está dentro del rango permitido
    if (!isValidTime(hora)) {
      return res.status(400).json({
        error: 'La hora debe estar entre 8:00 AM y 4:30 PM',
      });
    }

    // Verificar si la cita ya está reservada para esa fecha y hora
    const existingAgenda = await Agenda.findOne({ date, hora });
    if (existingAgenda) {
      return res.status(400).json({
        error: 'La hora seleccionada ya está reservada. Elija otra hora.',
      });
    }

    // Buscar al usuario en la base de datos por su email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear la cita con el userId extraído del usuario
    const newAgenda = new Agenda({
      userId: user._id, // Asigna el _id del usuario
      hora,
      date,
      email,
      name,
      status: 'reservada', // Marca la cita como reservada
    });

    // Guardar la cita en la base de datos
    await newAgenda.save();

    res
      .status(201)
      .json({ message: 'Cita generada exitosamente', agenda: newAgenda });
  } catch (error) {
    console.error('Error al generar la cita:', error);
    res.status(500).json({ error: 'Error en el servidor al generar la cita' });
  }
};

const getHorasDisponibles = async (req, res) => {
  const { date } = req.query; // La fecha será enviada como parámetro en la URL

  try {
    const reservedHours = await Agenda.find({ date }).select('hora'); // Obtener las horas ya reservadas
    const reservedSet = new Set(reservedHours.map((agenda) => agenda.hora)); // Convertir a un Set para búsqueda rápida

    // Generar todas las horas posibles de 8:00 AM a 4:30 PM en intervalos de 20 minutos
    const allHours = [];
    for (let hour = 8; hour < 17; hour++) {
      for (let minute of [0, 20, 40]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (hour === 16 && minute > 30) break; // Limitar hasta 4:30 PM
        if (!reservedSet.has(time)) {
          allHours.push(time);
        }
      }
    }

    res.status(200).json({ availableHours: allHours });
  } catch (error) {
    console.error('Error al obtener las horas disponibles:', error);
    res.status(500).json({ error: 'Error al obtener las horas disponibles' });
  }
};

module.exports = {

  postLogin,
  postRegistro,
  postRegistroAdmin,
  postTicket,
  getHorasDisponibles,
  postAgenda
}
