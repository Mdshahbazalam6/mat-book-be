"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectIdValidationInBody = exports.ObjectIdValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const Regex_1 = require("../constants/Regex");
const logger_1 = require("../common/logger");
const express_1 = require("../utils/express");
const MODULE = 'AUTH';
const ObjectIdValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            id: joi_1.default.string().pattern(Regex_1.REGEX.objectId).required()
        });
        const result = schema.validate({
            id: req.params.id
        });
        if (result.error) {
            logger_1.Logger.error(`[${MODULE}]: validation error - ${result.error.message}`);
            return res.status(400).json((0, express_1.responseFormatter)({ success: false, message: "Invalid Id", data: null, error_code: 400 }));
        }
        next();
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: validation error - ${error.message}`);
        return (0, express_1.responseFormatter)({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
    }
};
exports.ObjectIdValidation = ObjectIdValidation;
const ObjectIdValidationInBody = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            id: joi_1.default.string().pattern(Regex_1.REGEX.objectId).required()
        });
        const result = schema.validate(req.body);
        if (result.error) {
            logger_1.Logger.error(`[${MODULE}]: validation error - ${result.error.message}`);
            return res.status(400).json((0, express_1.responseFormatter)({ success: false, message: "Invalid Id", data: null, error_code: 400 }));
        }
        next();
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: validation error - ${error.message}`);
        return (0, express_1.responseFormatter)({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
    }
};
exports.ObjectIdValidationInBody = ObjectIdValidationInBody;
