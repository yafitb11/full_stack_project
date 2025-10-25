const express = require("express");
const router = express.Router();
const { getUsers, getOneUser, registerUser, updateUser, changeUserBizStatus, deleteUser, userLogin } = require("../services/userService");
const { errorhandler } = require("../../utils/errorhandler");
const { auth } = require("../../auth/authService");

router.get("/", auth, async (req, res) => {
    try {
        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be Admin!");
        }
        const users = await getUsers();
        return res.send(users);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, isAdmin } = req.user;
        if (!isAdmin && _id !== id) {
            return errorhandler(res, 403, "Authorization Error: Must be the registered user or Admin!");
        }
        const user = await getOneUser(id);
        res.send(user);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const user = await registerUser(req.body);
        return res.send(user);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.post("/login", async (req, res) => {
    try {
        const user = req.body;
        const loginRes = await userLogin(user);
        return res.send(loginRes);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.put("/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const { _id } = req.user;
        if (_id !== id) {
            return errorhandler(res, 403, "Authorization Error: Must be the registered user!");
        }
        const user = await updateUser(id, req.body);
        res.send(user);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.patch("/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const { _id } = req.user;
        if (_id !== id) {
            return errorhandler(res, 403, "Authorization Error: Must be the registered user!");
        }
        const user = await changeUserBizStatus(id);
        res.send(user);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const { _id, isAdmin } = req.user;
        if (!isAdmin && _id !== id) {
            return errorhandler(res, 403, "Authorization Error: Must be the registered user or Admin!");
        }
        const user = await deleteUser(id);
        res.send(user);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

module.exports = router;