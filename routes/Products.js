const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { Products, Tag } = require('../model');
const verifyToken = require('../middleware/verify');

//GET all products
router.get('/', verifyToken, async (req, res) => {
    try {
        // Pagination : ?page=1&limit=10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Récupération des produits
        let products = await Products.findAll({
            include: { model: Tag, attributes: ['TagId'] }, // uniquement les ID des tags
            offset,
            limit,
        });

        // Filtrer les produits en stock si ce n'est pas un admin
        if (!req.user || req.user.Type !== 'Admin') {
            products = products.filter(product => product.stock > 0);
        }

        // Transformer les produits pour ne garder que les IDs des tags
        const result = products.map(product => ({
            ProductsId: product.ProductsId,
            titre: product.titre,
            tags: product.Tags.map(tag => tag.TagId),
        }));

        res.status(200).json({
            page,
            limit,
            count: result.length,
            products: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

//GET product by id
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findByPk(id, { include: Tag });
        if ((!req.user || req.user.Type !== 'Admin') && product.stock <= 0) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        else {
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
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

//POST create new product
router.post('/', verifyToken, async (req, res) => {
    if (req.user.Type !== 'Admin' || !req.user) {
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
        }
    }
});

//DELETE product by id
router.delete('/:id', verifyToken, async (req, res) => {
    if (req.user.Type !== 'Admin' || !req.user) {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    const { id } = req.params;
    try {
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }
        await product.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

//PUT update product by id
router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.Type !== 'Admin' || !req.user) {
        return res.status(403).json({ error: 'Accès refusé' });
    }

    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    try {
        const product = await Products.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        // Mettre à jour les informations du produit
        product.name = name;
        product.description = description;
        product.price = price;

        await product.save();

        // Mettre à jour les tags si fournis
        if (tags && tags.length > 0) {
            const tagRecords = await Tag.findAll({ where: { name: tags } });
            await product.setTags(tagRecords);
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;