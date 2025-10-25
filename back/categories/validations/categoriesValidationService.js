const validateCategoryWithJoi = require("./joi/validateCategoryWithJoi");
const config = require("config");
const validator = config.get("VALIDATOR") || "Joi";

const validateCategory = (category) => {
    if (validator === "Joi") {
        return validateCategoryWithJoi(category);
    }
}


module.exports = validateCategory;