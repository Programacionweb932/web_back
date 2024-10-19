const express = require('express');

c
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

cons
const User = require('../models/User');

const router = express.Router();

// Ruta de registro
router.
router
post('/register', async (req, res) => {
    
   
const { username, password } = req.body;

    

try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ username });
        if (userExists) {
            
           
return res.status(400).json({ message: 'El usuario ya existe' });
        }

        
        }

       

// Hashear la contraseña
        
       
const hashedPassword = await bcrypt.hash(password, 10);

        

       


// Crear un nuevo usuario
        
       
const newUser = new User({ username, password: hashedPassword });
        
       
await newUser.save();

        res.

        res


status(201).json({ message: 'Usuario registrado exitosamente' });

   
catch (error) {
        res.
        res

       
status(500).json({ error: 'Error en el servidor al registrar el usuario' });
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    

   


try {
        
       
// Buscar el usuario en la base de datos
        const user = await User.findOne({ username });
        
       
if (!user) {
            
           
return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        
        }

 


// Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        
        }

    
// Generar un token JWT
        
    
const token = jwt.sign({ userId: user._id }, 'secretoDelToken', { expiresIn: '1h' });

        res.

        res


       


json({ message: 'Login exitoso', token });

   
catch (error) {
        res.
       
status(500).json({ error: 'Error en el servidor durante el login' });
    }
;

module.exports = router;