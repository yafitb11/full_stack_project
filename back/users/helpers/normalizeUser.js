const normalizeUser = (rawUser) => {

    const name = {
        ...rawUser.name,
        middle: rawUser.middle || ""
    };

    const { url, alt } = rawUser.image;
    const image = {
        url:
            url ||
            "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
        alt: alt || "user image"
    };

    const address = {
        ...rawUser.address,
        state: rawUser.address.state || "not defined"
    };

    return {
        ...rawUser,
        name,
        image,
        address
    };
};

module.exports = normalizeUser;