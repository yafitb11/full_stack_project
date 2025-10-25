
const normalizeCategory = async (rawCategory) => {
    const { url, alt } = rawCategory.image;
    const image = {
        url:
            url ||
            "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
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