import Joi from "joi";

export const newOrderSchema = Joi.object({

    orderNumber: Joi.number().allow(""),
    items: Joi.array().items(Joi.string()).required(),
    totalPrice: Joi.number().required(),
});

