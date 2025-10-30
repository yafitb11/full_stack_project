const mongoose = require("mongoose");
const chalk = require("chalk");

const connectLocally = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/store_project_back");
        console.log(chalk.magentaBright("Connect Locally To MongoDB!"));
    } catch (error) {
        console.log(chalk.redBright("Failed to connect locally:", error));
        throw error;
    }
};

module.exports = connectLocally;