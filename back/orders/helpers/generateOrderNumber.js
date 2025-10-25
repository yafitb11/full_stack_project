const Order = require("../models/mongodb/Order");
const { handleBadRequest } = require("../../utils/errorhandler");
const lodash = require("lodash");

const generateBizNumber = async () => {
    const random = lodash.random(1000000, 9000000);

    try {
        const order = await Order.findOne({ bizNumber: random }, { bizNumber: 1, _id: 0 });
        if (order) { return generateBizNumber(); }
        return random;
    } catch (error) {
        return handleBadRequest("generateBizNumber", error);
    }
};

module.exports = generateBizNumber;