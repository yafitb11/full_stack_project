const config = require("config");
const ENV = config.get("NODE_ENV");

const connectToDb = async () => {
    if (ENV === "development") {
        const connectLocally = require("./mongoDB/connectLocally");
        await connectLocally();
    }
    if (ENV === "production") {
        const connectToAtlas = require("./mongoDB/connectToAtlas");
        await connectToAtlas();
    }
};

module.exports = connectToDb;