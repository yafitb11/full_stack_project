const normalizeUpdatedUser = (updatedUser) => {
    const normalizedUser = { ...updatedUser };

    if (updatedUser.name) {
        normalizedUser.name = {
            ...updatedUser.name,
            middle: updatedUser.name.middle || ""
        };
    }

    if (updatedUser.image) {
        normalizedUser.image = {
            url:
                updatedUser.image.url ||
                "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
            alt: updatedUser.image.alt || "normalizedUser image"
        };
    }

    if (updatedUser.address) {
        normalizedUser.address = {
            ...updatedUser.address,
            state: updatedUser.address.state || "not defined",

        };
    }

    return normalizedUser;
};

module.exports = normalizeUpdatedUser;
