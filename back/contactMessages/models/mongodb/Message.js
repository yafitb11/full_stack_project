const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("../../../mongoose validation generals/urlAndDefaultValidations");

const messageSchema = new mongoose.Schema({

    fullName: {
        ...DEFAULT_VALIDATION,
        trim: false,
        lowercase: false,
    },
    email: {
        type: String,
        match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
        required: true,
        lowercase: true,
        trim: true,
    },
    subject: {
        ...DEFAULT_VALIDATION,
        trim: false,
        lowercase: false,
    },
    description: {
        ...DEFAULT_VALIDATION,
        trim: false,
        lowercase: false,
        maxLength: 1024,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;