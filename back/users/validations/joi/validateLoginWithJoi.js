const joi = require("joi");

const validateLoginWithJoi = (user) => {

    const schema = joi.object({

        email: joi.string().ruleset.regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
            .rule({ message: "email address must be a valid email" }).required(),
        password: joi.string().ruleset.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-*&^%$#@!]).{9,}$/)
            .rule({ message: "password must include a small and a capital English letter, a number, and one of the signs: - * & ^ % $ # @ !" }).required()
    }).unknown(false);


    return schema.validate(user);

}

module.exports = validateLoginWithJoi;