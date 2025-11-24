const Category = require("./mongodb/Category");
const { handleBadRequest } = require("../../utils/errorhandler");
const config = require("config");
const DB = config.get("DB") || "MONGODB";

exports.find = async () => {
    if (DB === "MONGODB") {
        try {
            const categories = await Category.find();
            return Promise.resolve(categories);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("categories Not From MONGODB");
};

exports.findOneCategory = async (categoryId) => {
    if (DB === "MONGODB") {
        try {
            const category = await Category.findById(categoryId).populate("products");
            if (!category) { throw new Error("Could not find category in database"); }
            return Promise.resolve(category);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("category Not From MONGODB");
};


exports.create = async (normalizedCategory) => {
    if (DB === "MONGODB") {
        try {
            let category = new Category(normalizedCategory);
            category = await category.save();
            return Promise.resolve(category);
        } catch (error) {
            error.status = 400;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("createcategory not in mongodb");
};


exports.update = async (categoryId, normalizedCategory) => {
    if (DB === "MONGODB") {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(categoryId, normalizedCategory, { new: true });
            if (!updatedCategory) { throw new Error("Could not update this category because a category with this ID couldn't be found in database"); }
            return Promise.resolve(`updated category: ${updatedCategory}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("category Not From MONGODB");
};

exports.remove = async (categoryId) => {
    if (DB === "MONGODB") {
        try {
            let removedCategory = await Category.findById(categoryId);
            if (!removedCategory) { throw new Error("Could not delete this category because a category with this ID couldn't be found in database"); }

            removedCategory = await Category.findByIdAndDelete(categoryId);
            return Promise.resolve(`removed category: ${removedCategory}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("category Not From MONGODB");
};


exports.findCategoryByName = async (categoryName) => {
    if (DB === "MONGODB") {
        try {
            const category = await Category.findOne({ title: categoryName });
            if (!category) { return false; }
            return Promise.resolve(category);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("category Not From MONGODB");
};
