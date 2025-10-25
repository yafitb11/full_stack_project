const validateProductWithJoi = require("./joi/validateProductWithJoi");
const validateUpdatedProductWithJoi = require("./joi/validateUpdatedProductWithJoi");
const config = require("config");
const validator = config.get("VALIDATOR") || "Joi";

const validateProduct = (product) => {
    if (validator === "Joi") {
        return validateProductWithJoi(product);
    }
}

const validateUpdatedProduct = (updatedProduct) => {
    if (validator === "Joi") {
        return validateUpdatedProductWithJoi(updatedProduct);
    }
}


module.exports = { validateProduct, validateUpdatedProduct };