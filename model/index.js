const sequelize = require('../core/ORM.js');

const Tag = require('./Tags');
const Users = require('./Users');
const Products = require('./Products');
const Commandes = require('./Commandes');
const Panier = require('./Panier');
const CommandeProducts = require('./CommandeProducts');

// ==========================
// Product <-> Tag (N-N)
// ==========================
Products.belongsToMany(Tag, { through: 'ProductTags', foreignKey: 'productId' });
Tag.belongsToMany(Products, { through: 'ProductTags', foreignKey: 'tagId' });

// ==========================
// User <-> Commande (1-N)
// ==========================
Users.hasMany(Commandes, { foreignKey: 'userId' });
Commandes.belongsTo(Users, { foreignKey: 'userId' });

// ==========================
// Commande <-> Product (N-N)
// ==========================
Products.belongsToMany(Commandes, { through: CommandeProducts, foreignKey: 'productId' });
Commandes.belongsToMany(Products, { through: CommandeProducts, foreignKey: 'commandeId' });

// ==========================
// User <-> Product (via Panier, N-N)
// ==========================
Users.belongsToMany(Products, { through: Panier, foreignKey: 'userId' });
Products.belongsToMany(Users, { through: Panier, foreignKey: 'productId' });

sequelize.sync({ alter: true });

module.exports = {
    Tag,
    Users,
    Products,
    Commandes, 
    Panier,
    CommandeProducts
};
