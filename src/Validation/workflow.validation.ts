import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { REGEX } from "../constants/Regex";
import { Logger } from "../common/logger";
import { responseFormatter } from "../utils/express";

const MODULE = 'WORKFLOW';


const stepSchema = Joi.object({
  // id: Joi.string().required(),
  // _id: Joi.string().pattern(REGEX.objectId).required(),
  type: Joi.string().valid('apiCall', 'email', 'textBox').required(),
  // position: Joi.object({
  //   x: Joi.number().required(),
  //   y: Joi.number().required(),
  // }).required(),
  data: Joi.object().required(), //  Flexible data - further validation can be added per type if needed
}).unknown(true);;

export const createWorkflowValidation = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(5).required(),
      description: Joi.string().min(10).required(),
      steps: Joi.array().items(stepSchema).default([]),
      status: Joi.string().valid('Draft', 'Active', 'Completed', 'Failed').default('Draft'),
      execute: Joi.boolean().default(false),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      Logger.error(`[${MODULE}]: validation error - ${result.error.message}`)
      return res.status(400).json(responseFormatter({ success: false, message: "Invalid data", data: null, error_code: 400 }));
    }

    next();
  } catch (error: any) {
    Logger.error(`[${MODULE}]: validation error - ${error.message}`);
    return responseFormatter({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
  }
}

export const updateWorkflowValidation = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      description: Joi.string().min(10).required(),
      steps: Joi.array().items(stepSchema),
      status: Joi.string().valid('Draft', 'Active', 'Completed', 'Failed'),
      execute: Joi.boolean().default(false),
      // stepOrder: Joi.array().items(Joi.string()).default([]),
    }).unknown(true);;

    const result = schema.validate(req.body);
    if (result.error) {
      Logger.error(`[${MODULE}]: validation error - ${result.error.message}`)
      return res.status(400).json(responseFormatter({ success: false, message: "Invalid data", data: null, error_code: 400 }));
    }

    next();
  } catch (error: any) {
    Logger.error(`[${MODULE}]: validation error - ${error.message}`);
    return responseFormatter({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
  }
}

// Execution history schema validation
const executionHistorySchema = Joi.object({
  executedBy: Joi.string().pattern(REGEX.objectId).required(), // MongoDB ObjectId format
  status: Joi.string().valid("Success", "Failed", "In Progress").required(),
  timestamp: Joi.date().default(() => new Date()),
  duration: Joi.number().min(0).optional(), // Time in milliseconds (must be positive)
  errorMessage: Joi.string().allow(null, "").optional(), // Allow empty error messages
});

// Middleware for execution history validation
export const logExecutionValidation = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const schema = Joi.object({
      _id: Joi.string().pattern(REGEX.objectId).required(), // Workflow ID must be a valid MongoDB ObjectId
      status: Joi.string().valid("Success", "Failed", "In Progress").required(),
      duration: Joi.number().min(0).optional(),
      errorMessage: Joi.string().allow(null, "").optional(),
    }).unknown(true);

    const result = schema.validate(req.body);
    if (result.error) {
      Logger.error(`[${MODULE}]: Validation error - ${result.error.message}`);
      return res
        .status(400)
        .json(responseFormatter({ success: false, message: "Invalid execution log data", data: null, error_code: 400 }));
    }

    next();
  } catch (error: any) {
    Logger.error(`[${MODULE}]: Validation error - ${error.message}`);
    return responseFormatter({ success: false, message: "Validation Failed", data: null, error_code: 400 });
  }
};
