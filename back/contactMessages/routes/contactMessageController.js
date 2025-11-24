const express = require("express");
const router = express.Router();
const { getMessages, getOneMessage, postMessage, deleteMessage } = require("../services/contactMessageService");
const { errorhandler } = require("../../utils/errorhandler");
const { auth } = require("../../auth/authService");

router.get("/", auth, async (req, res) => {
    try {
        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const messages = await getMessages();
        return res.send(messages);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.get("/:id", auth, async (req, res) => {
    try {
        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const id = req.params.id;
        const message = await getOneMessage(id);
        res.send(message);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const message = await postMessage(req.body);
        return res.status(201).send(message);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const messageId = req.params.id;
        const message1 = await getOneMessage(messageId);
        if (!message1) {
            return errorhandler(res, 404, "message could not be found");
        }
        const message = await deleteMessage(messageId);
        res.send(message);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

module.exports = router;