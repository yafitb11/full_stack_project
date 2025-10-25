const jwt = require("jsonwebtoken");
const config = require("config");

key = config.get("JWT_KEY");

const generateAuthToken = (user) => {
    const { _id, isAdmin } = user;
    const token = jwt.sign({ _id, isAdmin }, key);
    return token;
};

const verifyToken = (token) => {
    try {
        const userData = jwt.verify(token, key);
        return userData;
    } catch (error) {
        return null;
    }
};

exports.generateAuthToken = generateAuthToken;
exports.verifyToken = verifyToken;