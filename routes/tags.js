const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { Tag } = require('../model');
const verifyToken = require('../middleware/verify');

//GET all tags
router.get('/', verifyToken, async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

//POST create new tag
router.post('/', verifyToken, async (req, res) => {
    if (req.user.Type !== 'Admin' || !req.user) {
        return res.status(403).json({ error: 'Accès refusé' });
    }
    else {
        const { name } = req.body;
        try {
            const newTag = await Tag.create({ name });
            res.status(201).json(newTag);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
});

//PUT update tag
router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.Type !== 'Admin' || !req.user) {
        return res.status(403).json({ error: 'Accès refusé' });
    }
    else {
        const { id } = req.params;
        const { name } = req.body;
        try {
            const tag = await Tag.findByPk(id);
            if (!tag) {
                return res.status(404).json({ error: 'Tag non trouvé' });
            }
            tag.name = name;
            await tag.save();
            res.status(200).json(tag);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
});

//DELETE tag
router.delete('/:id', verifyToken, async (req, res) => {
    if (req.user.Type !== 'Admin' || !req.user) {
        return res.status(403).json({ error: 'Accès refusé' });
    } else {
        const { id } = req.params;
        try {
            const tag = await Tag.findByPk(id);
            if (!tag) {
                return res.status(404).json({ error: 'Tag non trouvé' });
            }
            await tag.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
});

module.exports = router;