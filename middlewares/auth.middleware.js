const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(request, response, next) {
    const token = req.headers.authorization;

    if (!token) {
        return response.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;

        next();
    }
    catch (error) {
        console.error("Erreur JWT :", error.message);
        return response.sendStatus(401);
    }
}

module.exports = authMiddleware;
