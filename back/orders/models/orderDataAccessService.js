const Order = require("../models/mongodb/Order");
const { handleBadRequest } = require("../../utils/errorhandler");
const config = require("config");
const DB = config.get("DB") || "MONGODB";


exports.findMyOrders = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const myOrders = await Order.find({ user_id: userId }).populate("items.product");
            if (myOrders.length === 0) { return Promise.resolve("you haven't made any orders yet"); }
            return Promise.resolve(myOrders);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Order Not From MONGODB");
};

exports.findOneOrder = async (orderId) => {
    if (DB === "MONGODB") {
        try {
            const order = await Order.findById(orderId).populate("items.product");
            if (!order) { throw new Error("Could not find order in database"); }
            return Promise.resolve(order);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Order Not From MONGODB");
};


exports.create = async (normalizedOrder) => {
    if (DB === "MONGODB") {
        try {
            let order = new Order(normalizedOrder);
            order = await order.save();
            return Promise.resolve(order);
        } catch (error) {
            error.status = 400;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("created Order not in mongodb");
};


exports.remove = async (orderId) => {
    if (DB === "MONGODB") {
        try {
            let removedOrder = await Order.findById(orderId);
            if (!removedOrder) { throw new Error("Could not delete this order because an order with this ID couldn't be found in database"); }

            removedOrder = await Order.findByIdAndDelete(orderId);
            return Promise.resolve(`removed order: ${removedOrder}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Order Not From MONGODB");
};