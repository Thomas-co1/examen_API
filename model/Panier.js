const sequelize = require('../core/ORM.js');
const { DataTypes } = require('sequelize');

const Panier = sequelize.define('Panier', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

module.exports = Panier;