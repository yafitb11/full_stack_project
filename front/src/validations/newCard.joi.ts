import Joi from "joi";

export const newCardSchema = Joi.object({

    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string()
        .ruleset.regex(/0[0-9]{1,2}-?\s?[0-9]{3}\s?[0-9]{4}/)
        .rule({ message: 'user "phone" mast be a valid phone number' })
        .required(),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),

    web: Joi.string().min(14).allow(""),

    image: Joi.object()
        .keys({
            url: Joi.string()
                .ruleset.regex(
                    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
                )
                .rule({ message: "user image mast be a valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        })
        .required(),
    address: Joi.object()
        .keys({
            state: Joi.string().allow(""),
            country: Joi.string().required(),
            city: Joi.string().required(),
            street: Joi.string().required(),
            houseNumber: Joi.number().required(),
            zip: Joi.number().allow(null),
        })
        .required(),

});