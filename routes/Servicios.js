const express = require('express');
const router = express.Router();
const Servicios  = require('../models/Servicios'); // Importar el modelo correspondiente
const Mascotas = require('../models/Mascotas');
const Jaulas = require('../models/Jaulas');
const Personal = require('../models/Personal');

// Ruta para crear un nuevo servicio
router.post('/', async (req, res) => {
    try {
        console.log('Datos recibidos en el backend:', req.body);
        const {
            fecha_ingreso,
            tipo_corte,
            observaciones,
            domicilio,
            metodo_pago,
            pulgas,
            garrapatas,
            jaula_id,
            peluquero_id,
            recepcionista_id,
            mascota_id,
            firma,
        } = req.body;
        console.log('Firma recibida:', firma);
        console.log('fecha_ingreso:', fecha_ingreso); // Valida que no sea null
        console.log('metodo_pago:', metodo_pago); // Valida que no sea null

        const nuevoServicio = await Servicios.create({
            fecha_ingreso,
            tipo_corte,
            observaciones,
            domicilio,
            metodo_pago,
            pulgas,
            garrapatas,
            jaula_id,
            peluquero_id,
            recepcionista_id,
            mascota_id,
            firma,
            estado: 'pendiente', // Por defecto, el estado inicial es pendiente
        });

        const jaula = await Jaulas.findByPk(jaula_id);
        if (jaula) {
            jaula.bloqueada = true; // Bloquea la jaula
            await jaula.save();
        }

        res.status(201).json(nuevoServicio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al registrar el servicio.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const servicios = await Servicios.findAll({
            include: [{ model: Mascotas },
                { model: Jaulas },
                { model: Personal, as: 'peluquero' },
                { model: Personal, as: 'recepcionista' }],
        });
        console.log('Servicios enviados al cliente:', servicios); 
        res.json(servicios);
    } catch (error) {
        console.error('Error fetching servicios:', error);
        res.status(500).json({ error: 'Error al obtener servicios.' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { estado, tipo_corte, observaciones } = req.body;

    try {
        const servicio = await Servicios.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado.' });
        }

        // Actualizar solo los campos que estén presentes en el cuerpo de la solicitud
        if (estado) servicio.estado = estado;
        if (tipo_corte) servicio.tipo_corte = tipo_corte;
        if (observaciones) servicio.observaciones = observaciones;

        await servicio.save();

        res.json(servicio);
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del servicio.' });
    }
});

router.put('/archivar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const servicio = await Servicios.findByPk(id);
        if (!servicio) {
            console.log('Servicio no encontrado:', id);
            return res.status(404).json({ error: 'Servicio no encontrado.' });
        }

        servicio.archivado = true;
        await servicio.save();

        console.log('Servicio archivado con éxito:', servicio.toJSON()); // Log completo del servicio archivado
        res.json(servicio);
    } catch (error) {
        console.error('Error al archivar servicio:', error);
        res.status(500).json({ error: 'Error al archivar el servicio.' });
    }
});

router.get('/grooming-dashboard', async (req, res) => {
    try {
        const servicios = await Servicios.findAll({
            include: [
                {
                    model: Jaulas,
                    as: 'Jaula',
                    attributes: ['id', 'color', 'numero'], // Incluye el color y número de la jaula
                },
                {
                    model: Mascotas,
                    as: 'Mascota',
                    attributes: ['nombre'], // Incluye información de la mascota
                },
                {
                    model: Personal,
                    as: 'peluquero',
                    attributes: ['nombre'], // Incluye el nombre del peluquero
                },
                {
                    model: Personal,
                    as: 'recepcionista',
                    attributes: ['nombre'], // Incluye el nombre de la recepcionista
                },
            ],
            where: {
                archivado: false, // Solo servicios no archivados
            },
        });

        res.json(servicios);
    } catch (error) {
        console.error('Error al obtener servicios para el dashboard:', error);
        res.status(500).json({ error: 'Error al obtener servicios.' });
    }
});



module.exports = router;
