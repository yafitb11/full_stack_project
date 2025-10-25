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
    items: [String],
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;