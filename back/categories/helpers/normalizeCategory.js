
const normalizeCategory = async (rawCategory) => {
    const { url, alt } = rawCategory.image;
    const image = {
        url:
            url ||
            "https://queue-it.com/media/ppcp1twv/product-drop.jpg",
        alt: alt || "category image",
    };

    const description = rawCategory.description || "";

    return {
        ...rawCategory,
        image,
        description,
    };
};

module.exports = normalizeCategory;