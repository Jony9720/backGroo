const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Personal = sequelize.define('Personal', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('recepcionista', 'peluquero'),
        allowNull: false,
    },
});



module.exports = Personal;
