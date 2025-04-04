"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../common/logger");
const User_model_1 = require("../model/User.model");
const express_1 = require("../utils/express");
const MODULE = "ADMIN";
const createUser = async (req, res) => {
    try {
        const userExists = await User_model_1.User.findOne({ email: req.body.email }).lean();
        if (userExists) {
            return res.status(409).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 409, message: "Email already exists" }));
        }
        //hash the password
        const hash = await bcrypt_1.default.hash(req.body.password, 10);
        req.body.password = hash;
        let result = await new User_model_1.User(req.body).save();
        if (!result) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 400, message: "failed to create user" }));
        }
        return res.status(200).json((0, express_1.responseFormatter)({ data: result, success: true, message: "User created successfully" }));
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error in creating user ${error.message}`);
        return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 400, message: "failed to create user" }));
    }
};
exports.createUser = createUser;
const signInUser = async (req, res) => {
    try {
        const user = await User_model_1.User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 409, message: "User not found" }));
        }
        const bryptPasswd = await bcrypt_1.default.compare(req.body.password, user.password || '');
        if (!bryptPasswd)
            res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 409, message: "Invalid Credentials" }));
        //@ts-ignore
        const token = await user.getJWT();
        res.cookie("chatToken", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });
        return res.status(200).json((0, express_1.responseFormatter)({ data: user, success: true, message: "User logged in successfully" }));
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error in creating user ${error.message}`);
        return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 400, message: "failed to create user" }));
    }
};
exports.signInUser = signInUser;
