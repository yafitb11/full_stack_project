
const normalizeUpdatedCategory = async (rawCategory) => {
    const updatedCategory = { ...rawCategory };

    if (rawCategory.image) {
        updatedCategory.image = {
            url:
                rawCategory.image.url ||
                "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
            alt: rawCategory.image.alt || "category image"
        };
    }

    if (rawCategory.subtitle) {
        updatedCategory.subtitle = rawCategory.subtitle || "";
    }

    return updatedCategory;
};

module.exports = normalizeUpdatedCategory;