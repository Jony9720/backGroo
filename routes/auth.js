const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sesion = require('../models/Sesion');
const router = express.Router();

const JWT_SECRET = 'tu_clave_secreta_aqui';

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre, password, rol } = req.body;

        // Validar datos
        if (!nombre || !password || !rol) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Sesion.findOne({ where: { nombre } });
        if (existingUser) {
            return res.status(400).json({ error: 'El nombre ya está registrado.' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = await Sesion.create({ nombre, password: hashedPassword, rol });
        res.status(201).json({ message: 'Usuario registrado con éxito.', usuario: nuevoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { nombre, password } = req.body;

        // Validar credenciales
        const usuario = await Sesion.findOne({ where: { nombre } });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Middleware para verificar token
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = { router, authenticate };
