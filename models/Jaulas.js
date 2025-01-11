const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Jaulas = sequelize.define('Jaulas', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    color: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    bloqueada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['color', 'numero'], // Restricción única compuesta
        },
    ],
});



module.exports = Jaulas;
