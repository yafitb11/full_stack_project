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
app.listen(port, async () => {
    console.log(chalk.yellow(`I'm listening to ${port}`));
    connectToDb();
    await generateInitialProducts();
    await generateInitialUsers();
})