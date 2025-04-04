"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("../utils/express");
const logger_1 = require("../common/logger");
const env_1 = require("../config/env");
const MODULE = "AUTH";
const Auth = (req, res, next) => {
    try {
        const token = req.cookies.chatToken;
        if (!token || Array.isArray(token)) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 400, message: "Token not provided" }));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.Config.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 400, message: "Invalid Token" }));
        }
        // @ts-ignore
        req.locals = decoded;
        next();
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error in user authentication ${error.message}`);
        return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 400, message: "Authentication Failed" }));
    }
};
exports.Auth = Auth;
