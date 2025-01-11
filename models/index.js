const Mascotas = require('./Mascotas');
const Servicios = require('./Servicios');
const Jaulas = require('./Jaulas');
const Personal = require('./Personal');

// Definir asociaciones
Servicios.belongsTo(Mascotas, { foreignKey: 'mascota_id' });
Mascotas.hasMany(Servicios, { foreignKey: 'mascota_id' });

Servicios.belongsTo(Jaulas, { foreignKey: 'jaula_id' });
Jaulas.hasMany(Servicios, { foreignKey: 'jaula_id' });

Servicios.belongsTo(Personal, { foreignKey: 'peluquero_id', as: 'peluquero' });
Servicios.belongsTo(Personal, { foreignKey: 'recepcionista_id', as: 'recepcionista' });

module.exports = {
    Mascotas,
    Servicios,
    Jaulas,
    Personal,
};
