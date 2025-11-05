const express = require('express');
const {Op} = require('sequelize');

const bcrypt = require('bcrypt');

const router = express.Router();

const { Users } =  require('../model');

const jwt = require('jsonwebtoken');


router.post('/register', (req, res) => {
    //prend Email, password et confimPassword depuis le body
    const {email, password, confirmPassword, Type, name } = req.body;
    //vérifier si adresse email valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({error: 'Email invalide'});
    }
    //vérifier si password et confirmPassword sont identiques
    if (password !== confirmPassword) {
        return res.status(400).json({error: 'Les mots de passe ne correspondent pas'});
    }
    //vérifier si password > 8 caractères
    if (password.length < 8) {
        return res.status(400).json({error: 'Le mot de passe doit contenir au moins 8 caractères'});
    }
    //Chiffrement de MDP via bcrypt
    const crypted = bcrypt.hashSync(password, 10);

    //créer un user avec sequelize
    const newUser = Users.create({email, password: crypted, Type, name});

    return res.status(201).json({message: 'Utilisateur créé avec succès'});
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Vérification de l'existence de l'utilisateur
    const user = await Users.findOne({ where: { email } });
    if (!user) {
        return res.status(403).json({ error: 'Utilisateur ou mot de passe incorrect' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ error: 'Utilisateur ou mot de passe incorrect' });
    }

    const token = jwt.sign(
        { userId: user.UsersId }, // correspond à ton modèle
        process.env.JWT_PRIVATE_TOKEN,
        { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
});



module.exports = router;