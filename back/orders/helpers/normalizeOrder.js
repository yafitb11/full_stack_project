const generateOrderNumber = require("./generateOrderNumber");

const normalizeOrder = async (rawcategory, userId) => {

    return {
        ...rawcategory,
        orderNumber: rawcategory.orderNumber || (await generateOrderNumber()),
        user_id: userId,
    };
};

module.exports = normalizeOrder;