"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidation = exports.signUpValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const Regex_1 = require("../constants/Regex");
const logger_1 = require("../common/logger");
const express_1 = require("../utils/express");
const MODULE = 'AUTH';
const signUpValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            firstName: joi_1.default.string().pattern(Regex_1.REGEX.firstName).required(),
            lastName: joi_1.default.string().pattern(Regex_1.REGEX.lastName).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().pattern(Regex_1.REGEX.password).required(),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            logger_1.Logger.error(`[${MODULE}]: validation error - ${result.error.message}`);
            return res.status(400).json((0, express_1.responseFormatter)({ success: false, message: "Invalid data", data: null, error_code: 400 }));
        }
        next();
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: validation error - ${error.message}`);
        return (0, express_1.responseFormatter)({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
    }
};
exports.signUpValidation = signUpValidation;
const signInValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().pattern(Regex_1.REGEX.password).required(),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            logger_1.Logger.error(`[${MODULE}]: validation error - ${result.error.message}`);
            return res.status(400).json((0, express_1.responseFormatter)({ success: false, message: "Invalid data", data: null, error_code: 400 }));
        }
        next();
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: validation error - ${error.message}`);
        return (0, express_1.responseFormatter)({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
    }
};
exports.signInValidation = signInValidation;
