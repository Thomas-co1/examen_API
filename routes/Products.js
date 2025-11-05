const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { Products, Tag } = require('../model');
const verifyToken = require('../middleware/verify');

//GET all products
router.get('/products', verifyToken, async (req, res) => {
    try {
        const products = await Products.findAll({ include: Tag });
        //n'affiche que les produits dont la quantité est > 0
        if (!req.user || req.user.Type !== 'Admin') {
            const filteredProducts = products.filter(product => product.stock > 0);
            res.status(200).json(filteredProducts);
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

//GET product by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findByPk(id, { include: Tag });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Produit non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

//POST create new product
router.post('/', async (req, res) => {
    if (verifyToken(req, res) !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé' });
    }
    else {
        const { name, description, price, tags } = req.body;
        try {
            const newProduct = await Products.create({ name, description, price });
            if (tags && tags.length > 0) {
                const tagRecords = await Tag.findAll({ where: { name: tags } });
                await newProduct.addTags(tagRecords);
            }
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }}
});


router.get('/', verifyToken, (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      message: req.tokenError || 'Aucun token fourni',
      admin: false
    });
  }

  if (req.user.Type === 'Admin') {
    return res.status(200).json({
      message: 'Bienvenue, administrateur !',
      admin: true
    });
  }

  return res.status(200).json({
    message: 'Bienvenue, utilisateur !',
    admin: false
  });
});

module.exports = router;