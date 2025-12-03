const Joi = require("joi");

const validateUpdatedProductWithJoi = (updatedProduct) => {
    const urlRegex = /^(https?:\/\/)(localhost(:\d+)?|(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})(\/[^\s]*)?$/;

    const schema = Joi.object({
        title: Joi.string().min(2).max(256),
        subtitle: Joi.string().min(2).max(256).allow(""),
        description: Joi.string().min(2).max(1024),
        image: Joi.object().keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: "image product url address must be valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        }),
        quantityInStock: Joi.number().allow(0),
        price: Joi.number(),
        isDiscount: Joi.boolean(),
        discountedPrice: Joi.number()
            .min(0)
            .less(Joi.ref('price'))
            .when('isDiscount', {
                is: true,
                then: Joi.required(),
                otherwise: Joi.forbidden()
            }),
    }).unknown(false);

    return schema.validate(updatedProduct);
};

module.exports = validateUpdatedProductWithJoi;