import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { REGEX } from "../constants/Regex";
import { Logger } from "../common/logger";
import { responseFormatter } from "../utils/express";

const MODULE = 'AUTH';

export const signUpValidation = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const schema = Joi.object({
            firstName: Joi.string().pattern(REGEX.firstName).required(),
            lastName: Joi.string().pattern(REGEX.lastName).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(REGEX.password).required(),
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

export const signInValidation = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(REGEX.password).required(),
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