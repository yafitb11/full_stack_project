const Product = require("../models/mongodb/Product");
const { handleBadRequest } = require("../../utils/errorhandler");
const config = require("config");
const DB = config.get("DB") || "MONGODB";

exports.find = async () => {
    if (DB === "MONGODB") {
        try {
            const products = await Product.find();
            return Promise.resolve(products);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Products Not From MONGODB");
};

/*
exports.findCategoryProducts = async (categoryId) => {
    if (DB === "MONGODB") {
        try {
            const categoryProducts = await Product.find({ category_id: categoryId }, {});
            if (categoryProducts.length === 0) { return Promise.resolve("you have no products in this category"); }
            return Promise.resolve(categoryProducts);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Product Not From MONGODB");
};
*/

exports.findOneProduct = async (productId) => {
    if (DB === "MONGODB") {
        try {
            const product = await Product.findById(productId);
            if (!product) { throw new Error("Could not find product in database"); }
            return Promise.resolve(product);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Product Not From MONGODB");
};


exports.create = async (normalizedProduct) => {
    if (DB === "MONGODB") {
        try {
            let product = new Product(normalizedProduct);
            product = await product.save();
            return Promise.resolve(product);
        } catch (error) {
            error.status = 400;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("created Product not in mongodb");
};


exports.update = async (productId, normalizedProduct) => {
    if (DB === "MONGODB") {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(productId, normalizedProduct, { new: true });
            if (!updatedProduct) { throw new Error("Could not update this product because a product with this ID couldn't be found in database"); }
            return Promise.resolve(`updated product: ${updatedProduct}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Product Not From MONGODB");
};

exports.like = async (productId, userId) => {
    if (DB === "MONGODB") {
        try {
            let product = await Product.findById(productId);
            if (!product) { throw new Error("Could not change product likes because a product with this ID couldn't be found in database"); }

            const productLikes = product.likes.find((id) => id === userId);
            product.likes = productLikes ? product.likes.filter(id => id !== userId) : [...product.likes, userId];
            product = await product.save();
            return Promise.resolve(`product after likes change: ${product}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Product Not From MONGODB");
};

exports.remove = async (productId) => {
    if (DB === "MONGODB") {
        try {
            let removedProduct = await Product.findById(productId);
            if (!removedProduct) { throw new Error("Could not delete this product because a product with this ID couldn't be found in database"); }

            removedProduct = await Product.findByIdAndDelete(productId);
            return Promise.resolve(`removed product: ${removedProduct}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Product Not From MONGODB");
};