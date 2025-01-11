const express = require('express');
const router = express.Router();
const Personal = require('../models/Personal');

// Crear un miembro del personal
router.post('/', async (req, res) => {
    try {
        const { nombre, rol } = req.body;
        const personal = await Personal.create({ nombre, rol });
        res.status(201).json(personal);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el personal.' });
    }
});

// Obtener todo el personal
router.get('/', async (req, res) => {
    try {
        const personal = await Personal.findAll();
        res.json(personal);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el personal.' });
    }
});

// Eliminar un miembro del personal
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Personal.destroy({ where: { id } });
        res.json({ message: result ? 'Personal eliminado.' : 'Personal no encontrado.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el personal.' });
    }
});

module.exports = router;
