
const normalizeUpdatedCategory = async (rawCategory) => {
    const updatedCategory = { ...rawCategory };

    if (rawCategory.image) {
        updatedCategory.image = {
            url:
                rawCategory.image.url || "https://queue-it.com/media/ppcp1twv/product-drop.jpg",
            alt: rawCategory.image.alt || "category image"
        };
    }

    if (rawCategory.subtitle) {
        updatedCategory.subtitle = rawCategory.subtitle || "";
    }

    return updatedCategory;
};

module.exports = normalizeUpdatedCategory;