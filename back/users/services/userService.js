const { find, findOneUser, createUser, login, update, changeBizStatus, remove } = require("../models/usersDataAccessService");
const { validateRegistration, validateLogin, validateUserUpdate } = require("../validations/userValidationService");
const normalizeUser = require("../helpers/normalizeUser");
const normalizeUpdatedUser = require("../helpers/normlizeUpdatedUser");
const { generateUserPassword } = require("../helpers/bcrypt");
const { handleJoiError } = require("../../utils/errorhandler");

exports.getUsers = async () => {
    try {
        const users = await find();
        return Promise.resolve(users);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.getOneUser = async (userId) => {
    try {
        const user = await findOneUser(userId);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.registerUser = async (rawUser) => {
    try {
        const { error } = validateRegistration(rawUser);
        if (error) {
            return handleJoiError(error);
        }
        let user = normalizeUser(rawUser);
        user.password = generateUserPassword(user.password);
        user = await createUser(user);
        return Promise.resolve(user);

    } catch (error) {
        return Promise.reject(error);
    }
};


exports.userLogin = async (rawUser) => {
    try {
        const { error } = validateLogin(rawUser);
        if (error) {
            return handleJoiError(error);
        }
        let user = { ...rawUser };
        user = await login(user);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.updateUser = async (userId, rawUser) => {
    try {
        const { error } = validateUserUpdate(rawUser);
        if (error) {
            return handleJoiError(error);
        }
        let user = normalizeUpdatedUser(rawUser);
        user = await update(userId, user);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.changeUserBizStatus = async (userId) => {
    try {
        const user = await changeBizStatus(userId);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};

exports.deleteUser = async (userId) => {
    try {
        const user = await remove(userId);
        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
};
