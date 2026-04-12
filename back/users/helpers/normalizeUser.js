const config = require("config");
const baseUrl = config.get("BASE_URL");

const normalizeUser = (rawUser) => {

    const name = {
        ...rawUser.name,
        middle: rawUser.middle || ""
    };

    const { url, alt } = rawUser.image;
    const image = {
        url:
            url || `${baseUrl}/public/grayUser.jpg`,
        alt: alt || "user image"
    };

    const address = {
        ...rawUser.address,
        state: rawUser.address.state || ""
    };

    return {
        ...rawUser,
        name,
        image,
        address
    };
};

module.exports = normalizeUser;