const Joi = require("joi");

const validateOrderWithJoi = (order) => {

    const schema = Joi.object({

        orderNumber: Joi.number().allow(""),
        items: Joi.array().items(Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().required(),
        })).min(1).required(),
        totalItems: Joi.number().required(),
        totalPrice: Joi.number().required(),
        paymentDetails: Joi.object({
            cardNumber: Joi.number().required(),
            expiryDate: Joi.date().required(),
            cvv: Joi.number().required(),
            cardholderName: Joi.string().required(),
        }).required(),
    }).unknown(false);

    return schema.validate(order);
};

module.exports = validateOrderWithJoi;