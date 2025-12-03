const mongoose = require("mongoose");
const imageSchema = require("../../../mongoose validation generals/Image");
const { DEFAULT_VALIDATION } = require("../../../mongoose validation generals/urlAndDefaultValidations");

const categorieschema = new mongoose.Schema({

    title: DEFAULT_VALIDATION,
    description: {
        ...DEFAULT_VALIDATION,
        maxLength: 1024,
        minLength: 0,
        required: false,
    },
    image: imageSchema,
    createdAt: {
        type: Date,
        default: Date.now
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Category = mongoose.model("Category", categorieschema);

module.exports = Category;