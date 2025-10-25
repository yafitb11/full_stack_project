const { find, findCategoryProducts, findOneProduct, create, update, like, remove } = require("../models/productsDataAccessService");
const { validateProduct, validateUpdatedProduct } = require("../validations/productValidationService");
const normalizeProduct = require("../helpers/normalizeProduct");
const normalizeUpdatedProduct = require("../helpers/normalizeUpdatedProduct");
const { handleJoiError } = require("../../utils/errorhandler");

exports.getProducts = async () => {
    try {
        const products = await find();
        return Promise.resolve(products);
    } catch (error) {
        return Promise.reject(error);
    }
};

/*
exports.getCategoryProducts = async (categoryId) => {
    try {
        const categoryProducts = await findCategoryProducts(categoryId);
        return Promise.resolve(categoryProducts);
    } catch (error) {
        return Promise.reject(error);
    }
};
*/

exports.getOneProduct = async (productId) => {
    try {
        const product = await findOneProduct(productId);
        return Promise.resolve(product);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.createProduct = async (rawProduct) => {
    try {
        const { error } = validateProduct(rawProduct);
        if (error) {
            return handleJoiError(error);
        }

        let product = await normalizeProduct(rawProduct);
        product = await create(product);
        return Promise.resolve(product);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.updateProduct = async (productId, rawProduct) => {
    try {
        const { error } = validateUpdatedProduct(rawProduct);
        if (error) {
            return handleJoiError(error);
        }

        let product = normalizeUpdatedProduct(rawProduct);
        product = await update(productId, product);
        return Promise.resolve(product);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.likeProduct = async (productId, userId) => {
    try {
        const product = await like(productId, userId);
        return Promise.resolve(product);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.deleteProduct = async (productId) => {
    try {
        const product = await remove(productId);
        return Promise.resolve(product);
    } catch (error) {
        return Promise.reject(error);
    }
};
