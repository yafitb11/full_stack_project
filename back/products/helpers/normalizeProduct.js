
const normalizeProduct = async (rawProduct, categoryId) => {
    const { url, alt } = rawProduct.image;
    const image = {
        url:
            url ||
            "https://redbikemarketing.com/wp-content/uploads/2019/06/product.png",
        alt: alt || "Product Image",
    };

    const subtitle = rawProduct.subtitle || "";
    return {
        ...rawProduct,
        image,
        subtitle,
        category_id: rawProduct.category_id || categoryId,
    };
};

module.exports = normalizeProduct;