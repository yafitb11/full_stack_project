const chalk = require("chalk");

const errorhandler = (res, status, message) => {
    console.log(chalk.red(message));
    res.status(status).send(message);

}

const handleBadRequest = (validator, error) => {
    const errorMessage = `${validator} ERROR: ${error}`;
    error.message = errorMessage;
    error.status = error.status || 400;
    return Promise.reject(error);
}

const handleJoiError = (error) => {
    const joiError = new Error(error.details[0].message);
    return handleBadRequest("Joi", joiError);
}

module.exports = { errorhandler, handleBadRequest, handleJoiError };