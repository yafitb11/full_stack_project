const joi = require("joi");
const config = require('../../../config/configInitialData');

const validateRegistrationWithJoi = (user) => {
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const schema = joi.object({
        name: joi.object().keys({
            first: joi.string().min(2).max(256).required(),
            middle: joi.string().min(2).max(256).allow(""),
            last: joi.string().min(2).max(256).required(),
        }),
        isBusiness: joi.boolean().required(),
        phone: joi.string().ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
            .rule({ message: "phone must be a valid israeli number" }).required(),
        email: joi.string().ruleset.regex(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
            .rule({ message: "email address must be a valid email" }).required(),
        password: joi.string().ruleset.regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-*&^%$#@!]).{9,}$/)
            .rule({ message: "password must include a small and a capital English letter, a number, and one of the signs: - * & ^ % $ # @ !" }).required(),
        image: joi.object().keys({
            url: joi.string().ruleset.regex(urlRegex)
                .rule({ message: "url address must be a valid url" }).allow(""),
            alt: joi.string().min(2).max(256).allow(""),
        }),
        address: joi.object().keys({
            state: joi.string().min(2).max(256).allow(""),
            country: joi.string().min(2).max(256).required(),
            city: joi.string().min(2).max(256).required(),
            street: joi.string().min(2).max(256).required(),
            houseNumber: joi.number().greater(0).required(),
            zip: joi.number().min(1000).allow(0),
        }),
        isAdmin: config.hasInitialData ? joi.forbidden() : joi.boolean()
    }).unknown(false);

    return schema.validate(user);

};

module.exports = validateRegistrationWithJoi;