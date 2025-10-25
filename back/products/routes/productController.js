const express = require("express");
const router = express.Router();
const { getProducts, getCategoryProducts, getOneProduct, createProduct, updateProduct, likeProduct, deleteProduct } = require("../services/productService");
const { errorhandler } = require("../../utils/errorhandler");
const { auth } = require("../../auth/authService");

router.get("/", async (req, res) => {
    try {
        const products = await getProducts();
        return res.send(products);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

/*
//no need for double option to get category items, maybe I will delete it
router.get("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categoryProducts = await getCategoryProducts(categoryId);
        return res.send(categoryProducts);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});
*/

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getOneProduct(id);
        res.send(product);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

//צריך לשנות את זה שזה לא יהיה בפאראמז אלא דרך אחרת להעביר את המידע של קטגוריID
router.post("/", auth, async (req, res) => {
    try {
        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const categoryId = req.params.categoryId;
        const product = await createProduct(req.body, categoryId);
        return res.status(201).send(product);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.put("/:id", auth, async (req, res) => {
    try {
        const productId = req.params.id;
        const product1 = await getOneProduct(productId);
        if (!product1) {
            return errorhandler(res, 404, "Product not found");
        }

        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }

        const product = await updateProduct(productId, req.body);
        res.send(product);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

router.patch("/:id", auth, async (req, res) => {
    try {
        const { _id } = req.user;
        if (!_id) {
            return errorhandler(res, 403, "Authorization Error: Must be a registered user!");
        }
        const productId = req.params.id;
        const product = await likeProduct(productId, _id);
        res.send(product);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const productId = req.params.id;
        const product1 = await getOneProduct(productId);
        if (!product1) {
            return errorhandler(res, 404, "Product not found");
        }

        const { isAdmin } = req.user;
        if (!isAdmin) {
            return errorhandler(res, 403, "Authorization Error: Must be the Admin!");
        }
        const product = await deleteProduct(productId);
        res.send(product);
    } catch (error) {
        return errorhandler(res, error.status || 500, error.message);
    }
});

module.exports = router;