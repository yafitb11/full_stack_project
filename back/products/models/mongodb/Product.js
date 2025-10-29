const mongoose = require("mongoose");
const imageSchema = require("../../../mongoose validation generals/Image");
const { DEFAULT_VALIDATION } = require("../../../mongoose validation generals/urlAndDefaultValidations");

const productSchema = new mongoose.Schema({

    title: DEFAULT_VALIDATION,
    subtitle: {
        ...DEFAULT_VALIDATION,
        required: false,
    },
    description: {
        ...DEFAULT_VALIDATION,
        maxLength: 1024,
    },
    image: imageSchema,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    quantityInStock: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    isDiscount: {
        type: Boolean,
        default: false,
    },
    discountedPrice: {
        type: Number,
        required: function () {
            return this.isDiscount === true;
        },
        min: 0,
        validate: {
            validator: function (value) {
                return !this.isDiscount || value < this.price;
            },
            message: "Discounted price must be lower than the regular price.",
        },
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    likes: [String],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;