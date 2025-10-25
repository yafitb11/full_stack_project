const normalizeUpdatedProduct = (updatedProduct) => {
    const normalizedProduct = { ...updatedProduct };

    if (updatedProduct.image) {
        normalizedProduct.image = {
            url:
                updatedProduct.image.url ||
                "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
            alt: updatedProduct.image.alt || "product image"
        };
    }

    if (updatedProduct.subtitle) {
        normalizedProduct.subtitle = updatedProduct.subtitle || "";
    }

    return normalizedProduct;
};

module.exports = normalizeUpdatedProduct;