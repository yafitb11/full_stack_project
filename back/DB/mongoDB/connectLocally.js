const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
    .connect("mongodb://localhost:27017/store_project_back")
    .then(() => console.log(chalk.magentaBright("Connect Locally To MongoDB!")))
    .catch((error) => {
        console.log(chalk.redBright(error));
    });

