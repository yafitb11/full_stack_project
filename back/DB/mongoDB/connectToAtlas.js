const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("config");
userName = config.get("DB_NAME");
password = config.get("DB_PASSWORD");



mongoose
mongoose
    .connect(`mongodb+srv://${userName}:${password}@backend-store.zsctmwo.mongodb.net/backend-store`, {
        serverSelectionTimeoutMS: 5000,
    })
    .then(async () => {
        const collections = await mongoose.connection.db.listCollections().toArray();

        if (collections.length === 0) {
            console.log(chalk.yellow("Warning: Connected, but no collections found. Are you using the right DB name?"));
        }

        console.log(chalk.magentaBright("Connect To Atlas MongoDB! Verified."));
    })
    .catch((error) => {
        console.log(chalk.redBright("Actual Error found:"), error.message);
    });
