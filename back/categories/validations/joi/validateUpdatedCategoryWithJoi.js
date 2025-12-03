const Joi = require("joi");

const validateUpdatedCategoryWithJoi = (category) => {
    const urlRegex = /^(https?:\/\/)(localhost(:\d+)?|(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})(\/[^\s]*)?$/;

    const schema = Joi.object({
        title: Joi.string().min(2).max(256),
        description: Joi.string().min(2).max(1024).allow(""),
        image: Joi.object().keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: "image url address must be valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        }),
    }).unknown(false);

    return schema.validate(category);
};

module.exports = validateUpdatedCategoryWithJoi;