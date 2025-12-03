const normalizeUpdatedProduct = (updatedProduct) => {
    const normalizedProduct = { ...updatedProduct };

    if (updatedProduct.image) {
        normalizedProduct.image = {
            url:
                updatedProduct.image.url ||
                "https://redbikemarketing.com/wp-content/uploads/2019/06/product.png",
            alt: updatedProduct.image.alt || "product image"
        };
    }

    if (updatedProduct.subtitle) {
        normalizedProduct.subtitle = updatedProduct.subtitle || "";
    }

    return normalizedProduct;
};

module.exports = normalizeUpdatedProduct;