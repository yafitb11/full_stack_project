const chalk = require("chalk");
const morgan = require("morgan");
const errorLogger = require("./errorLogger");

const morganLogger =
    morgan(
        (tokens, req, res) => {
            const status = Number(tokens.status(req, res));

            errorLogger(req, res);

            const statusMessage = [
                tokens.date(req, res, "iso"),
                tokens.method(req, res),
                tokens.url(req, res),
                status,
                "-",
                tokens["response-time"](req, res), "ms",
            ].join(" ");

            return (status >= 400 ? chalk.red : chalk.green)(statusMessage);

        }
    )

module.exports = morganLogger;

