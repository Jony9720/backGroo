const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Servicios = sequelize.define('Servicios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tipo_corte: {
        type: DataTypes.STRING,
    },
    observaciones: {
        type: DataTypes.TEXT,
    },
    domicilio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    metodo_pago: {
        type: DataTypes.ENUM('efectivo', 'tarjeta'),
        allowNull: false,
    },
    pulgas: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    garrapatas: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'en progreso', 'finalizado'),
        defaultValue: 'pendiente',
        allowNull: false,
    },
    archivado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },    
    hora_finalizacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },    
    firma: {
        type: DataTypes.TEXT, // Campo para almacenar la firma en formato Base64
        allowNull: true,
    },    
});

module.exports = Servicios;
