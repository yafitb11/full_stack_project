const mongoose = require("mongoose");
const imageSchema = require("../../../mongoose validation generals/Image");
const { DEFAULT_VALIDATION } = require("../../../mongoose validation generals/urlAndDefaultValidations");
const Category = require("../../../categories/models/mongodb/Category");

const productSchema = new mongoose.Schema({

    title: DEFAULT_VALIDATION,
    subtitle: {
        ...DEFAULT_VALIDATION,
        minLength: 0,
        default: "",
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    likes: [String],
});

productSchema.post('save', async function (doc) {
    try {
        await Category.findByIdAndUpdate(
            doc.category_id,
            { $addToSet: { products: doc._id } },
            { new: true }
        );
    } catch (error) {
        console.error('Error updating category:', error);
    }
});

productSchema.pre('findByIdAndDelete', async function () {
    try {
        const productId = this.getQuery()._id;
        await Category.updateMany(
            { products: productId },
            { $pull: { products: productId } }
        );
    } catch (error) {
        console.error('Error removing product from category:', error);
    }
});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;