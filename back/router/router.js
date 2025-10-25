const express = require("express");
const router = express.Router();
const productController = require("../products/routes/productController");
const userController = require("../users/routes/userController");
const orderController = require("../orders/routes/orderController");
const categoryController = require("../categories/routes/caegoryController");
const { errorhandler } = require("../utils/errorhandler");

router.use("/products", productController);
router.use("/users", userController);
router.use("/orders", orderController);
router.use("/categories", categoryController);
router.use((req, res) => { errorhandler(res, 404, "page not found") });

module.exports = router;