const express = require('express');
const router = express.Router();
const Mascotas = require('../models/Mascotas');

// Crear una mascota
router.post('/', async (req, res) => {
    try {
        const { nombre, peso, propietario_nombre, propietario_contacto, domicilio } = req.body;
        const mascota = await Mascotas.create({ nombre, peso, propietario_nombre, propietario_contacto, domicilio });
        res.status(201).json(mascota);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la mascota.' });
    }
});

// Obtener todas las mascotas
router.get('/', async (req, res) => {
    try {
        const mascotas = await Mascotas.findAll();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mascotas.' });
    }
});

router.get('/buscar', async (req, res) => {
    const { query } = req.query; // Obtener el texto de búsqueda
    try {
        const mascotas = await Mascotas.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${query}%` } },
                    { propietario_nombre: { [Op.like]: `%${query}%` } },
                ],
            },
        });
        res.json(mascotas);
    } catch (error) {
        console.error('Error al buscar mascotas:', error);
        res.status(500).json({ error: 'Error al buscar mascotas.' });
    }
});


// Obtener una mascota por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mascota = await Mascotas.findByPk(id);
        if (mascota) {
            res.json(mascota);
        } else {
            res.status(404).json({ error: 'Mascota no encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la mascota.' });
    }
});

// Actualizar una mascota
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, peso, propietario_nombre, propietario_contacto, domicilio } = req.body;

        const mascota = await Mascotas.findByPk(id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada.' });
        }

        mascota.nombre = nombre || mascota.nombre;
        mascota.peso = peso || mascota.peso;
        mascota.propietario_nombre = propietario_nombre || mascota.propietario_nombre;
        mascota.propietario_contacto = propietario_contacto || mascota.propietario_contacto;
        mascota.domicilio = domicilio || mascota.domicilio;

        await mascota.save();
        res.json(mascota);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la mascota.' });
    }
});

// Eliminar una mascota
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Mascotas.destroy({ where: { id } });
        res.json({ message: result ? 'Mascota eliminada.' : 'Mascota no encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la mascota.' });
    }
});

module.exports = router;
