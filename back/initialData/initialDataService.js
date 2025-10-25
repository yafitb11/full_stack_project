const data = require("./initialData.json");
const normalizeUser = require("../users/helpers/normalizeUser");
const normalizeProduct = require("../products/helpers/normalizeProduct");
const normalizeCategory = require("../categories/helpers/normalizeCategory");
const { createUser, find: findPrevUsers } = require("../users/models/usersDataAccessService");
const { create: createProduct, find: findPrevProducts } = require("../products/models/productsDataAccessService");
const { create: createCategory } = require("../categories/models/categoriesDataAccessService");
const { generateUserPassword } = require("../users/helpers/bcrypt");
const chalk = require("chalk");
const config = require('../config/configInitialData');

const generateInitialProducts = async () => {
    const previousProducts = await findPrevProducts();
    if (previousProducts.length == 0) {
        const { categories } = data;
        try {
            let category = await normalizeCategory(categories[0]);
            category = await createCategory(category);

            const { products } = data;

            await Promise.all(products.map(async (product) => {
                const categoryId = category._id;
                const normalizedProduct = await normalizeProduct(product, categoryId);
                await createProduct(normalizedProduct);
            }));
            console.log(chalk.green("Initial products created successfully"));
        } catch (error) {
            return console.log(chalk.red(error.message));
        }

    } else {
        console.log(chalk.blue("Products already exist, skipping initial data creation"));
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