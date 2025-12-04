const { findMyOrders, findOneOrder, create, remove, findAllOrders } = require("../models/orderDataAccessService");
const normalizeOrder = require("../helpers/normalizeOrder");
const { handleJoiError } = require("../../utils/errorhandler");
const validateOrder = require("../validations/orderValidationService");

exports.getMyOrders = async (userId) => {
    try {
        const myOrders = await findMyOrders(userId);
        return Promise.resolve(myOrders);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.getOneOrder = async (orderId) => {
    try {
        const order = await findOneOrder(orderId);
        return Promise.resolve(order);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.createOrder = async (rawOrder, userId) => {
    try {
        const { error } = validateOrder(rawOrder);
        if (error) {
            return handleJoiError(error);
        }

        let order = await normalizeOrder(rawOrder, userId);
        order = await create(order);
        return Promise.resolve(order);
    } catch (error) {
        return Promise.reject(error);
    }
};


exports.deleteOrder = async (orderId) => {
    try {
        const order = await remove(orderId);
        return Promise.resolve(order);
    } catch (error) {
        return Promise.reject(error);
    }
};


exports.getAllOrders = async () => {
    try {
        const orders = await findAllOrders();
        return Promise.resolve(orders);
    } catch (error) {
        return Promise.reject(error);
    }
};