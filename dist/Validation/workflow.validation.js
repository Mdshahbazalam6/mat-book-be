"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logExecutionValidation = exports.updateWorkflowValidation = exports.createWorkflowValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const Regex_1 = require("../constants/Regex");
const logger_1 = require("../common/logger");
const express_1 = require("../utils/express");
const MODULE = 'WORKFLOW';
const stepSchema = joi_1.default.object({
    // id: Joi.string().required(),
    // _id: Joi.string().pattern(REGEX.objectId).required(),
    type: joi_1.default.string().valid('apiCall', 'email', 'textBox').required(),
    // position: Joi.object({
    //   x: Joi.number().required(),
    //   y: Joi.number().required(),
    // }).required(),
    data: joi_1.default.object().required(), //  Flexible data - further validation can be added per type if needed
}).unknown(true);
;
const createWorkflowValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            name: joi_1.default.string().min(5).required(),
            description: joi_1.default.string().min(10).required(),
            steps: joi_1.default.array().items(stepSchema).default([]),
            status: joi_1.default.string().valid('Draft', 'Active', 'Completed', 'Failed').default('Draft'),
            execute: joi_1.default.boolean().default(false),
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
exports.createWorkflowValidation = createWorkflowValidation;
const updateWorkflowValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            name: joi_1.default.string(),
            description: joi_1.default.string().min(10).required(),
            steps: joi_1.default.array().items(stepSchema),
            status: joi_1.default.string().valid('Draft', 'Active', 'Completed', 'Failed'),
            execute: joi_1.default.boolean().default(false),
            // stepOrder: Joi.array().items(Joi.string()).default([]),
        }).unknown(true);
        ;
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
exports.updateWorkflowValidation = updateWorkflowValidation;
// Execution history schema validation
const executionHistorySchema = joi_1.default.object({
    executedBy: joi_1.default.string().pattern(Regex_1.REGEX.objectId).required(), // MongoDB ObjectId format
    status: joi_1.default.string().valid("Success", "Failed", "In Progress").required(),
    timestamp: joi_1.default.date().default(() => new Date()),
    duration: joi_1.default.number().min(0).optional(), // Time in milliseconds (must be positive)
    errorMessage: joi_1.default.string().allow(null, "").optional(), // Allow empty error messages
});
// Middleware for execution history validation
const logExecutionValidation = (req, res, next) => {
    try {
        const schema = joi_1.default.object({
            _id: joi_1.default.string().pattern(Regex_1.REGEX.objectId).required(), // Workflow ID must be a valid MongoDB ObjectId
            status: joi_1.default.string().valid("Success", "Failed", "In Progress").required(),
            duration: joi_1.default.number().min(0).optional(),
            errorMessage: joi_1.default.string().allow(null, "").optional(),
        }).unknown(true);
        const result = schema.validate(req.body);
        if (result.error) {
            logger_1.Logger.error(`[${MODULE}]: Validation error - ${result.error.message}`);
            return res
                .status(400)
                .json((0, express_1.responseFormatter)({ success: false, message: "Invalid execution log data", data: null, error_code: 400 }));
        }
        next();
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Validation error - ${error.message}`);
        return (0, express_1.responseFormatter)({ success: false, message: "Validation Failed", data: null, error_code: 400 });
    }
};
exports.logExecutionValidation = logExecutionValidation;
