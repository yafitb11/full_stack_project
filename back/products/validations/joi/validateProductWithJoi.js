const Joi = require("joi");

const validateProductWithJoi = (product) => {

    const schema = Joi.object({
        title: Joi.string().min(2).max(256).required(),
        subtitle: Joi.string().min(2).max(256).allow(""),
        description: Joi.string().min(2).max(1024).required(),
        image: Joi.object().keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: "image product url address must be valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        }),
        quantityInStock: Joi.number().min(0).required(),
        price: Joi.number().min(1).required(),
        isDiscount: Joi.boolean(),
        discountedPrice: isDiscount ? Joi.number().min(0).required() : Joi.forbidden(),
    }).unknown(false);

    return schema.validate(product);
};

module.exports = validateProductWithJoi;