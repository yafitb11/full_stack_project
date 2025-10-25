const User = require("../models/nomgodb/User");
const { handleBadRequest } = require("../../utils/errorhandler");
const lodash = require("lodash");
const { comparePassword } = require("../helpers/bcrypt");
const config = require("config");
const DB = config.get("DB") || "MONGODB";
const { generateAuthToken } = require("../../auth/Providers/jwt");

exports.find = async () => {
    if (DB === "MONGODB") {
        try {
            const users = await User.find({}, { __v: 0, password: 0 });
            return Promise.resolve(users);
        } catch (error) {
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

exports.findOneUser = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const user = await User.findById(userId, { __v: 0, password: 0 });
            if (!user) { throw new Error("Could not find user in database"); }
            return Promise.resolve(user);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};


exports.createUser = async (normalizedUser) => {
    if (DB === "MONGODB") {
        try {
            const { email } = normalizedUser;
            let user = await User.findOne({ email: email });
            if (user) { throw new Error("user already registered"); }
            user = new User(normalizedUser);
            user = await user.save();
            user = lodash.pick(user, ["_id", "name", "email"]);
            return Promise.resolve(user);
        } catch (error) {
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("user created not in MONGODB");
};


exports.login = async (emailAndPassword) => {
    if (DB === "MONGODB") {
        try {
            const { email, password } = emailAndPassword;
            const user = await User.findOne({ email: email });
            if (!user) { throw new Error("invalid email"); }
            const validPassword = comparePassword(password, user.password);
            if (!validPassword) { throw new Error("invalid password"); }

            const token = generateAuthToken(user);
            return Promise.resolve(token);
        } catch (error) {
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("login user not in MONGODB");
};

exports.update = async (userId, normalizedUser) => {
    if (DB === "MONGODB") {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, normalizedUser, { new: true }).select("-password -__v");
            if (!updatedUser) { throw new Error("Could not update this user because a user with this ID couldn't be found in database"); }
            return Promise.resolve(`updated user: ${updatedUser}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

exports.changeBizStatus = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const pipeline = [
                { $set: { isBusiness: { $not: "$isBusiness" } } }
            ];
            const updatedUser = await User.findByIdAndUpdate(userId, pipeline, { new: true }).select("-password -__v");
            if (!updatedUser) { throw new Error("Could not update this user's bizStatus because a user with this ID couldn't be found in database"); }
            return Promise.resolve(`updated user: ${updatedUser}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};

exports.remove = async (userId) => {
    if (DB === "MONGODB") {
        try {
            const removedUser = await User.findByIdAndDelete(userId, { password: 0, __v: 0 });
            if (!removedUser) { throw new Error("Could not delete this user because a user with this ID couldn't be found in database"); }
            return Promise.resolve(`removed user: ${removedUser}`);
        } catch (error) {
            error.status = 404;
            return handleBadRequest("Mongoose", error);
        }
    }
    return Promise.resolve("Not From MONGODB");
};