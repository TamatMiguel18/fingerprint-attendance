// backend/src/config/jwtConfig.js

const jwt = require("jsonwebtoken");
const { JWT } = require("./env");

const generateToken = (payload) => {
    return jwt.sign(payload, JWT.SECRET, {
        expiresIn: JWT.EXPIRES
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT.SECRET);
};

module.exports = {
    generateToken,
    verifyToken
};