const { find, findOneCategory, create, remove } = require("../models/categoriesDataAccessService");
const validateCategory = require("../validations/categoriesValidationService");
const normalizeCategory = require("../helpers/normalizeCategory");
const { handleJoiError } = require("../../utils/errorhandler");

exports.getCategory = async () => {
    try {
        const categories = await find();
        return Promise.resolve(categories);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.getOneCategory = async (categoryId) => {
    try {
        const category = await findOneCategory(categoryId);
        return Promise.resolve(category);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.createCategory = async (rawcategory) => {
    try {
        const { error } = validateCategory(rawcategory);
        if (error) {
            return handleJoiError(error);
        }

        let category = await normalizeCategory(rawcategory);
        category = await create(category);
        return Promise.resolve(category);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.deleteCategory = async (categoryId) => {
    try {
        const category = await remove(categoryId);
        return Promise.resolve(category);
    } catch (error) {
        return Promise.reject(error);
    }
};
