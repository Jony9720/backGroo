const express = require('express');
const router = express.Router();
const Jaulas = require('../models/Jaulas');
const Servicios = require('../models/Servicios');
const { Op } = require('sequelize');

// Crear una jaula
router.post('/', async (req, res) => {
    try {
        const { color, numero } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!color || !numero) {
            return res.status(400).json({ error: 'El color y el número son obligatorios.' });
        }

        // Crear la jaula
        const jaula = await Jaulas.create({ color, numero });
        res.status(201).json(jaula);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Ya existe una jaula con este número y color.' });
        }
        res.status(500).json({ error: 'Error al crear la jaula.' });
    }
});

// Obtener todas las jaulas
router.get('/', async (req, res) => {
    try {
        const jaulas = await Jaulas.findAll();
        res.json(jaulas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las jaulas.' });
    }
})

router.get('/disponibles', async (req, res) => {
    try {
        const jaulasDisponibles = await Jaulas.findAll({
            where: {
                bloqueada: false, // No bloqueada
            },
            include: [
                {
                    model: Servicios,
                    required: false, // Join opcional
                    where: {
                        estado: { [Op.not]: 'en progreso' }, // Excluir servicios activos
                    },
                },
            ],
        });

        res.json(jaulasDisponibles);
    } catch (error) {
        console.error('Error al obtener jaulas disponibles:', error);
        res.status(500).json({ error: 'Error al obtener jaulas disponibles.' });
    }
});

// Bloquear/desbloquear una jaula
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { bloqueada } = req.body;
        const jaula = await Jaulas.findByPk(id);
        if (jaula) {
            jaula.bloqueada = bloqueada;
            await jaula.save();
            res.json(jaula);
        } else {
            res.status(404).json({ error: 'Jaula no encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la jaula.' });
    }
});

// Eliminar una jaula
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Jaulas.destroy({ where: { id } });
        res.json({ message: result ? 'Jaula eliminada.' : 'Jaula no encontrada.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la jaula.' });
    }
});

router.put('/liberar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const jaula = await Jaulas.findByPk(id);
        if (!jaula) {
            return res.status(404).json({ error: 'Jaula no encontrada.' });
        }

        jaula.bloqueada = false; // Liberar la jaula
        await jaula.save();

        const servicio = await Servicios.findOne({
            where: { jaula_id: id, estado: 'finalizado' },
            order: [['fecha_ingreso', 'DESC']],
        });
        if (servicio) {
            servicio.hora_finalizacion = new Date();
            await servicio.save();
        }

        res.json({ message: 'Jaula liberada con éxito.', jaula });
    } catch (error) {
        console.error('Error al liberar la jaula:', error);
        res.status(500).json({ error: 'Error al liberar la jaula.' });
    }
});


module.exports = router;
