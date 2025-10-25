const mongoose = require("mongoose");
const imageSchema = require("../../../mongoose validation generals/Image");
const { DEFAULT_VALIDATION } = require("../../../mongoose validation generals/urlAndDefaultValidations");

const categorieschema = new mongoose.Schema({

    title: DEFAULT_VALIDATION,
    description: {
        ...DEFAULT_VALIDATION,
        maxLength: 1024,
    },
    image: imageSchema,
    createdAt: {
        type: Date,
        default: Date.now
    },
    products: [String],
});

const Category = mongoose.model("category", categorieschema);

module.exports = Category;