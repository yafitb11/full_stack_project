const config = require("config");
const port = config.get("PORT");

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
                updatedUser.image.url || `http://localhost:${port}/public/grayUser.jpg`,
            alt: updatedUser.image.alt || "normalizedUser image"
        };
    }

    if (updatedUser.address) {
        normalizedUser.address = {
            ...updatedUser.address,
            state: updatedUser.address.state || "",

        };
    }

    return normalizedUser;
};

module.exports = normalizeUpdatedUser;
