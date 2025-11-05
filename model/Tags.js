const sequelize = require('../core/ORM.js');
const { DataTypes } = require('sequelize');

const Tag = sequelize.define('Tag', {
    TagId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, 
{
    timestamps: true
});

module.exports = Tag;