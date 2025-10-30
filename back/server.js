const { errorhandler } = require("./utils/errorhandler");
const express = require("express");
const app = express();
const chalk = require("chalk");
const router = require("./router/router");
const cors = require("./middlewares/cors");
const logger = require("./logger/loggerService");
const connectToDb = require("./DB/dbService");
const config = require("config");
const { generateInitialUsers, generateInitialProducts } = require("./initialData/initialDataService");


app.use(cors);
app.use(logger);
app.use(express.json());
app.use(express.text());
app.use(router);

app.use((err, req, res, next) => {
    console.log("Error middleware triggered with error:", err);
    console.log("errorhandler type:", typeof errorhandler);
    errorhandler(res, err.status || 500, err.message);
})

const port = config.get("PORT");

const startServer = async () => {
    try {
        console.log(chalk.yellow("Starting server..."));
        await connectToDb();
        await generateInitialProducts();
        await generateInitialUsers();

        app.listen(port, () => {
            console.log(chalk.yellow(`Server is listening on port ${port}`));
        });
    } catch (error) {
        console.error(chalk.red("Failed to start server:", error));
        process.exit(1);
    }
};

startServer();