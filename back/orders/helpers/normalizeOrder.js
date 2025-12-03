const generateOrderNumber = require("./generateOrderNumber");

const normalizeOrder = async (rawOrder, userId) => {
    const { cardNumber, expiryDate, cvv, cardholderName } = rawOrder.paymentDetails;
    const paymentDetails = {
        cardNumber: cardNumber.toString(),
        expiryDate: expiryDate.toString(),
        cvv: cvv.toString(),
        cardholderName
    };

    return {
        ...rawOrder,
        paymentDetails,
        orderNumber: rawOrder.orderNumber || (await generateOrderNumber()),
        user_id: userId,
    };
};

module.exports = normalizeOrder;