const { verifyToken } = require("./Providers/jwt");
const { errorhandler } = require("../utils/errorhandler");
const config = require("config");

const tokenGenerator = config.get("TOKEN_GENERATOR") || "jwt";


const auth = (req, res, next) => {
    if (tokenGenerator === "jwt") {
        try {
            const tokenFromClient = req.header("x-auth-token");
            if (!tokenFromClient) {
                throw new Error("Authantication Error: Please Login/Authunticate");
            }

            const userData = verifyToken(tokenFromClient);
            if (!userData) {
                throw new Error("Authantication Error: Unauthrize User");
            }

            req.user = userData;
            return next();
        } catch (error) {
            return errorhandler(res, 401, error.message);
        }
    }
    return errorhandler(res, 500, "Use jwt!");
};

exports.auth = auth;