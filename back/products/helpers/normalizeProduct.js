
const normalizeProduct = async (rawProduct, categoryId) => {
    const { url, alt } = rawProduct.image;
    const image = {
        url:
            url ||
            "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
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