const Message = require("./mongodb/Message");
const { handleBadRequest } = require("../../utils/errorhandler");
const config = require("config");
const DB = config.get("DB") || "MONGODB";

exports.find = async () => {
    if (DB === "MONGODB") {
        try {
            const messages = await Message.find();
            return Promise.resolve(messages);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("messages Not From MONGODB");
};

exports.findOneMessage = async (messageId) => {
    if (DB === "MONGODB") {
        try {
            const message = await Message.findById(messageId);
            if (!message) { throw new Error("Could not find message in database"); }
            return Promise.resolve(message);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("message Not From MONGODB");
};


exports.create = async (normalizedMessage) => {
    if (DB === "MONGODB") {
        try {
            let message = new Message(normalizedMessage);
            message = await message.save();
            return Promise.resolve(message);
        } catch (error) {
            error.status = 400;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("created message not in mongodb");
};


exports.remove = async (messageId) => {
    if (DB === "MONGODB") {
        try {
            let removedMessage = await Message.findById(messageId);
            if (!removedMessage) { throw new Error("Could not delete this message because a message with this ID couldn't be found in database"); }

            removedMessage = await Message.findByIdAndDelete(messageId);
            return Promise.resolve(`removed message: ${removedMessage}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("message Not From MONGODB");
};


