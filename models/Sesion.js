const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sesion = sequelize.define('Sesion', {
    id: { // Es opcional, pero recomendado para buenas prácticas
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Asegura que no se repitan nombres
    },
    rol: {
        type: DataTypes.ENUM(
            'recepcion_principal',
            'recepcion_secundaria',
            'grooming_principal',
            'grooming_secundario'
        ),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Sesion;
