const Joi = require("joi");

const validateOrderWithJoi = (order) => {

    const schema = Joi.object({

        orderNumber: Joi.number().allow(""),
        items: Joi.array().items(Joi.string()).required(),
        totalPrice: Joi.number().required(),
    }).unknown(false);

    return schema.validate(order);
};

module.exports = validateOrderWithJoi;