const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");
userName = config.get("DB_NAME");
password = config.get("DB_PASSWORD");



mongoose
    .connect(
        `mongodb+srv://${userName}:${password}@backend-store.zsctmwo.mongodb.net/`
    )
    .then(() => console.log(chalk.magentaBright("Connect To Atlas MongoDB!")))
    .catch((error) => {
        console.log(chalk.redBright(error));
    });
