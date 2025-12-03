import Joi from "joi";

export const editUserSchema = Joi.object({
    name: Joi.object()
        .keys({
            first: Joi.string().min(2).max(256).required(),
            middle: Joi.string().min(2).max(256).allow(""),
            last: Joi.string().min(2).max(256).required(),
        }),

    phone: Joi.string()
        .ruleset.regex(/^0[0-9\s-]*$/)
        .rule({ message: 'user "phone" must start with 0 and contain only digits, spaces, and hyphens' })
        .custom((value, helpers) => {
            const digitsOnly = value.replace(/\D/g, '');
            const digitCount = digitsOnly.length;
            if (digitsOnly[0] !== '0') {
                return helpers.error('string.phoneStart');
            }
            if (digitCount < 9 || digitCount > 10) {
                return helpers.error('string.phoneLength');
            }
            return value;
        })
        .messages({
            'string.phoneStart': 'user "phone" must start with 0',
            'string.phoneLength': 'user "phone" must contain 9-10 digits',
        }),

    image: Joi.object()
        .keys({
            url: Joi.string()
                .ruleset.regex(
                    /^(https?:\/\/)(localhost(:\d+)?|(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})(\/[^\s]*)?$/
                )
                .rule({ message: "user image mast be a valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        }),

    address: Joi.object()
        .keys({
            state: Joi.string().allow(""),
            country: Joi.string().required(),
            city: Joi.string().required(),
            street: Joi.string().required(),
            houseNumber: Joi.number().greater(0).required(),
            zip: Joi.number().min(1000).allow(0),
        }),
});