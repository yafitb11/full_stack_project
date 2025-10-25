const Joi = require("joi");

const validateCategoryWithJoi = (category) => {

    const schema = Joi.object({
        title: Joi.string().min(2).max(256).required(),
        description: Joi.string().min(2).max(1024).allow(""),
        image: Joi.object().keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: "image card url address must be valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        }),
    }).unknown(false);

    return schema.validate(card);
};

module.exports = validateCategoryWithJoi;