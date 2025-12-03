const data = require("./initialData");
const normalizeUser = require("../users/helpers/normalizeUser");
const normalizeProduct = require("../products/helpers/normalizeProduct");
const normalizeCategory = require("../categories/helpers/normalizeCategory");
const { createUser, find: findPrevUsers } = require("../users/models/usersDataAccessService");
const { create: createProduct, find: findPrevProducts } = require("../products/models/productsDataAccessService");
const { create: createCategory } = require("../categories/models/categoriesDataAccessService");
const { generateUserPassword } = require("../users/helpers/bcrypt");
const chalk = require("chalk");
const config = require('../config/configInitialData');
const { findCategoryByName } = require("../categories/models/categoriesDataAccessService");

const generateInitialProducts = async () => {
    try {
        const previousProducts = await findPrevProducts();
        if (previousProducts.length > 0) {
            console.log(chalk.blue("Products already exist, skipping initial data creation"));
            return;
        }

        const { categories, products } = data;

        let category = await findCategoryByName("Electronics (initial-data)");
        if (!category) {
            const normalizedCategory = await normalizeCategory(categories[0]);
            category = await createCategory(normalizedCategory);
            console.log(chalk.green(`Category "${category.title}" created`));
        }

        await Promise.all(products.map(async (product) => {
            const normalizedProduct = await normalizeProduct(product, category._id);
            await createProduct(normalizedProduct);
        }));
        console.log(chalk.green("Initial products creation completed"));

    } catch (error) {
        console.log(chalk.red(error.message));
    }
};


const generateInitialUsers = async () => {
    const previousUsers = await findPrevUsers();
    if (previousUsers.length == 0) {
        config.hasInitialData = false;
        const { users } = data;
        try {
            await Promise.all(users.map(async (user) => {
                const normalizedUser = await normalizeUser(user);
                normalizedUser.password = generateUserPassword(normalizedUser.password);
                await createUser(normalizedUser);
            }));
            console.log(chalk.green("Initial users created successfully"));
            config.hasInitialData = true;
        } catch (error) {
            return console.log(chalk.red(error.message));
        }

    } else {
        config.hasInitialData = true;
        console.log(chalk.blue("Users already exist, skipping initial data creation"));
    }
};

module.exports = { generateInitialProducts, generateInitialUsers };