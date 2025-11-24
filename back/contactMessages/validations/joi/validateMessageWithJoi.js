const Joi = require("joi");

const validateMessageWithJoi = (message) => {

    const schema = Joi.object({
        fullName: Joi.string().min(2).max(256).required(),
        email: joi.string().ruleset.regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
            .rule({ message: "email address must be a valid email" }).required(),
        subject: Joi.string().min(2).max(256).required(),
        message: Joi.string().min(2).max(1024).required(),
    }).unknown(false);

    return schema.validate(message);
};

module.exports = validateMessageWithJoi;