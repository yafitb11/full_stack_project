const validateRegistrationWithJoi = require("./joi/validateRegistrationWithJoi");
const validateLoginWithJoi = require("./joi/validateLoginWithJoi");
const userUpdateValidation = require("./joi/userUpdateValidation");
const validator = undefined || "Joi";

const validateRegistration = (user) => {
    if (validator === "Joi") {
        return validateRegistrationWithJoi(user);
    }
};

const validateLogin = (user) => {
    if (validator === "Joi") {
        return validateLoginWithJoi(user);
    }
};

const validateUserUpdate = (user) => {
    if (validator === "Joi") {
        return userUpdateValidation(user);
    }
};

module.exports = { validateRegistration, validateLogin, validateUserUpdate };