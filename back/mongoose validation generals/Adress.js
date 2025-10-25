const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("./urlAndDefaultValidations");

const addressSchema = new mongoose.Schema({
    state: {
        type: String,
        minLength: 2,
        required: false,
    },
    country: DEFAULT_VALIDATION,
    city: DEFAULT_VALIDATION,
    street: DEFAULT_VALIDATION,
    housNumber: {
        type: Number,
        trim: true,
        minLength: 1,
        required: true,
    },
    zip: {
        type: Number,
        trim: true,
        minLength: 4,
        default: 0,
    }
});

module.exports = addressSchema;
