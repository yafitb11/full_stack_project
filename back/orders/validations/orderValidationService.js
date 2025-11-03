const validateOrderWithJoi = require("./joi/validateOrderWithJoi");
const config = require("config");
const validator = config.get("VALIDATOR") || "Joi";

const validateOrder = (order) => {
    if (validator === "Joi") {
        return validateOrderWithJoi(order);
    }
}


module.exports = validateOrder;