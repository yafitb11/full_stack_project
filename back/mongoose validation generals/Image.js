const mongoose = require("mongoose");
const { URL, DEFAULT_VALIDATION } = require("./urlAndDefaultValidations");

const imageSchema = new mongoose.Schema({
    url: URL,
    alt: DEFAULT_VALIDATION,
});

module.exports = imageSchema;