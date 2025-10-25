const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");
userName = config.get("DB_NAME");
password = config.get("DB_PASSWORD");



mongoose
    .connect(
        `mongodb+srv://${userName}:${password}@cluster0.nidw9jm.mongodb.net/`
    )
    .then(() => console.log(chalk.magentaBright("Connect To Atlas MongoDB!")))
    .catch((error) => {
        console.log(chalk.redBright(error));
    });
