import Joi from "joi";

export const newCategorySchema = Joi.object({

    title: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).allow(""),
    image: Joi.object()
        .keys({
            url: Joi.string()
                .ruleset.regex(
                    /^(https?:\/\/)(localhost(:\d+)?|(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})(\/[^\s]*)?$/
                )
                .rule({ message: "user image mast be a valid url" })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        })
        .required(),
});

