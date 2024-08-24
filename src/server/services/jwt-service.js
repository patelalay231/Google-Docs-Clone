const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

function createToken(user){
    const payload = {
        _id: user._id,
        username: user.username,
    }
    return jwt.sign(payload, `${JWT_SECRET}`);
}

function verifyToken(token){
    return jwt.verify(token, `${JWT_SECRET}`);
}

module.exports = {
    createToken,
    verifyToken
}