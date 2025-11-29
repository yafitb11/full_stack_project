import Joi from "joi";

export const paymentSchema = Joi.object({
    cardNumber: Joi.string()
        .pattern(/^[0-9]{16}$/)
        .required()
        .messages({
            "string.pattern.base": "Card number must be 16 digits",
            "string.empty": "Card number is required",
        }),

    expiryDate: Joi.string()
        .pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
        .required()
        .messages({
            "string.pattern.base": "Expiry date must be MM/YY",
            "string.empty": "Expiry date is required",
        }),

    cvv: Joi.string()
        .pattern(/^[0-9]{3}$/)
        .required()
        .messages({
            "string.pattern.base": "CVV must be 3 digits",
            "string.empty": "CVV is required",
        }),

    cardholderName: Joi.string()
        .min(2)
        .required()
        .messages({
            "string.min": "Name must be at least 2 characters",
            "string.empty": "Cardholder name is required",
        }),
});
