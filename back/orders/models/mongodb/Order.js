const { object, number } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    orderNumber: {
        type: Number,
        minLength: 1,
        maxLength: 9,
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    totalItems: { type: Number },
    totalPrice: { type: Number },
    paymentDetails: {
        cardNumber: { type: String, required: true },
        expiryDate: { type: Date, required: true },
        cvv: { type: String, required: true },
        cardholderName: { type: String, required: true }
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;