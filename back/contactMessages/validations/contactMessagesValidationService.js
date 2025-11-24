const validateMessageWithJoi = require("./joi/validateMessageWithJoi");
const config = require("config");
const validator = config.get("VALIDATOR") || "Joi";

const validateMessage = (message) => {
    if (validator === "Joi") {
        return validateMessageWithJoi(message);
    }
}


module.exports = { validateMessage };