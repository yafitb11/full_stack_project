const validateCategoryWithJoi = require("./joi/validateCategoryWithJoi");
const validateUpdatedCategoryWithJoi = require("./joi/validateUpdatedCategoryWithJoi");
const config = require("config");
const validator = config.get("VALIDATOR") || "Joi";

const validateCategory = (category) => {
    if (validator === "Joi") {
        return validateCategoryWithJoi(category);
    }
}

const validateUpdatedCategory = (category) => {
    if (validator === "Joi") {
        return validateUpdatedCategoryWithJoi(category);
    }
}

module.exports = { validateCategory, validateUpdatedCategory };