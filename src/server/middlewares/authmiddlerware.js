const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

function AuthMiddleWare(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded._id;
        req.username = decoded.username;
        next();
    } catch (error) {
        res.status(403).json({
            Error: error.message
        });
    }
}

module.exports = {
    AuthMiddleWare
}