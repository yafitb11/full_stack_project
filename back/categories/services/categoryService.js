const { find, findOneCategory, create, update, remove } = require("../models/categoriesDataAccessService");
const { validateCategory, validateUpdatedCategory } = require("../validations/categoriesValidationService");
const normalizeCategory = require("../helpers/normalizeCategory");
const normalizeUpdatedCategory = require("../helpers/normalizeUpdatedCategory");
const { handleJoiError } = require("../../utils/errorhandler");

exports.getCategories = async () => {
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

exports.updateCategory = async (categoryId, rawCategory) => {
    try {
        const { error } = validateUpdatedCategory(rawCategory);
        if (error) {
            return handleJoiError(error);
        }

        let category = await normalizeUpdatedCategory(rawCategory);
        category = await update(categoryId, category);
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
