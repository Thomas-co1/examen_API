const jwt = require('jsonwebtoken');
const { Users } = require('../model');

function raise403(res) {
    res.status(403).json({ error: "JWT Token required" });
}

async function verifyToken(req, res, next) {
const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        // Aucun token fourni → visiteur
        req.user = null;
        req.isAdmin = false;
        req.role = 'visitor';
        console.log("Aucun token fourni");
        return next();
    }

    const token = bearer.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN);

        const user = await Users.findByPk(payload.UsersId);

        if (!user) {
            console.log("[verifyToken] Utilisateur non trouvé");
            return raise403(res);
        }

        req.user = user;

        next();

    } catch (err) {
        console.log("[verifyToken] Token invalide ou autre erreur :", err.message);
        return raise403(res);
    }
}

module.exports = verifyToken;
