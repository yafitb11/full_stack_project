const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../../../mongoose validation generals/urlAndDefaultValidations");

const nameSchema = new mongoose.Schema({
    first: DEFAULT_VALIDATION,
    middle: {
        type: String,
    },
    last: DEFAULT_VALIDATION,
});

module.exports = nameSchema;