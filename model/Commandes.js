const sequelize = require('../core/ORM.js');
const { DataTypes } = require('sequelize');

const Commandes = sequelize.define('Commandes', {
    CommandesId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

module.exports = Commandes;