import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { REGEX } from "../constants/Regex";
import { Logger } from "../common/logger";
import { responseFormatter } from "../utils/express";

const MODULE = 'AUTH';

export const ObjectIdValidation = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const schema = Joi.object({
            id: Joi.string().pattern(REGEX.objectId).required()
        });

        const result = schema.validate({
            id: req.params.id
        });
        if (result.error) {
            Logger.error(`[${MODULE}]: validation error - ${result.error.message}`)
            return res.status(400).json(responseFormatter({ success: false, message: "Invalid Id", data: null, error_code: 400 }));
        }

        next();
    } catch (error: any) {
        Logger.error(`[${MODULE}]: validation error - ${error.message}`);
        return responseFormatter({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
    }
}

export const ObjectIdValidationInBody = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const schema = Joi.object({
            id: Joi.string().pattern(REGEX.objectId).required()
        });

        const result = schema.validate(req.body);
        if (result.error) {
            Logger.error(`[${MODULE}]: validation error - ${result.error.message}`)
            return res.status(400).json(responseFormatter({ success: false, message: "Invalid Id", data: null, error_code: 400 }));
        }

        next();
    } catch (error: any) {
        Logger.error(`[${MODULE}]: validation error - ${error.message}`);
        return responseFormatter({ success: false, message: 'Validation Failed', data: null, error_code: 400 });
    }
}