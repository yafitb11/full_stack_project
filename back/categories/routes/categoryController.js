const express = require("express");
const router = express.Router();
const { getCategories, getOneCategory, createCategory, updateCategory, deleteCategory } = require("../services/categoryService");
const { errorhandler } = require("../../utils/errorhandler");
const { auth } = require("../../auth/authService");

router.get("/", async (req, res) => {
    try {
        const categories = await getCategories();
        return res.send(categories);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const category = await getOneCategory(id);
        res.send(category);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const category = await createCategory(req.body);
        return res.status(201).send(category);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.put("/:id", auth, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category1 = await getOneCategory(categoryId);
        if (!category1) {
            return errorhandler(res, 404, "category not found");
        }

        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const category = await updateCategory(categoryId, req.body);
        res.send(category);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category1 = await getOneCategory(categoryId);
        if (!category1) {
            return errorhandler(res, 404, "category not found");
        }

        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const category = await deleteCategory(categoryId);
        res.send(category);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

module.exports = router;