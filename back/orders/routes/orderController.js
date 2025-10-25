const express = require("express");
const router = express.Router();
const { getMyOrders, getOneOrder, createOrder, deleteOrder } = require("../services/orderService");
const { errorhandler } = require("../../utils/errorhandler");
const { auth } = require("../../auth/authService");


router.get("/my-orders", auth, async (req, res) => {
    try {
        const { _id } = req.user;
        const myOrders = await getMyOrders(_id);
        return res.send(myOrders);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const order = await getOneOrder(id);
        res.send(order);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { _id } = req.user;
        const order = await createOrder(req.body, _id);
        return res.status(201).send(order);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const orderId = req.params.id;
        const order1 = await getOneOrder(orderId);
        if (!order1) {
            return errorhandler(res, 404, "Order not found");
        }
        const userId = order1.user_id.toString();
        const { _id, isAdmin } = req.user;
        if (!isAdmin && _id !== userId) {
            return errorhandler(res, 403, "Authorization Error: Must be the user who created the order or Admin!");
        }
        const order = await deleteOrder(orderId);
        res.send(order);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

module.exports = router;