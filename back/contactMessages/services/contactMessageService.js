const { find, findOneMessage, create, remove } = require("../models/contactMessageDataAccessService");
const { validateMessage } = require("../validations/contactMessagesValidationService");
const { handleJoiError } = require("../../utils/errorhandler");

exports.getMessages = async () => {
    try {
        const messages = await find();
        return Promise.resolve(messages);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.getOneMessage = async (messageId) => {
    try {
        const message = await findOneMessage(messageId);
        return Promise.resolve(message);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.postMessage = async (rawMessage) => {
    try {
        const { error } = validateMessage(rawMessage);
        if (error) {
            return handleJoiError(error);
        }

        const message = await create(rawMessage);
        return Promise.resolve(message);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.deleteMessage = async (messageId) => {
    try {
        const message = await remove(messageId);
        return Promise.resolve(message);
    } catch (error) {
        return Promise.reject(error);
    }
};
