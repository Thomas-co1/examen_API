const sequelize = require('../core/ORM.js');
const { DataTypes } = require('sequelize');

const Products = sequelize.define('Products', {
    ProductsId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, 
{
    timestamps: true
});

module.exports = Products;