import Joi from "joi";

export const editProductSchema = Joi.object({

    title: Joi.string().min(2).max(256),
    subtitle: Joi.string().min(2).max(256).allow(""),
    description: Joi.string().min(2).max(1024),
    image: Joi.object()
        .keys({
            url: Joi.string()
                .ruleset.regex(
                    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
                )
                .rule({ message: "user image mast be a valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        }),
    category_id: Joi.string(),
    quantityInStock: Joi.number().min(0),
    price: Joi.number().min(1),
    isDiscount: Joi.boolean(),
    discountedPrice: Joi.number().min(0)
        .less(Joi.ref('price'))
        .when('isDiscount', {
            is: true,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        })

});