const { Sequelize} = require('sequelize');

const sequelize = new Sequelize('controle', 'admin', 'toto', {
  host: 'localhost',
  dialect: 'mysql' // or 'sqlite', 'postgres', 'mssql'
});

module.exports = sequelize;