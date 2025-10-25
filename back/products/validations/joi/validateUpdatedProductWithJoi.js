const Joi = require("joi");

const validateUpdatedProductWithJoi = (updatedProduct) => {

    const schema = Joi.object({
        title: Joi.string().min(2).max(256),
        subtitle: Joi.string().min(2).max(256),
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
        discountedPrice: isDiscount ? Joi.number() : Joi.forbidden(),
        //  category_id:
    }).unknown(false);

    return schema.validate(updatedProduct);
};

module.exports = validateUpdatedProductWithJoi;