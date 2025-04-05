import JWT from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { responseFormatter } from "../utils/express";
import { Logger } from "../common/logger";
import { Config } from "../config/env";
import { TokenPayload } from "../types";

const MODULE = "AUTH";

export const Auth = (req: Request, res: Response, next: NextFunction): any => {
    try {
        const token = req.cookies.chatToken

        if (!token || Array.isArray(token)) {
            return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 400, message: "Token not provided" }));
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
        if (!decoded) {
            return res.status(400).json(responseFormatter({ data: null, success: false, error_code: 400, message: "Invalid Token" }));
        }

        // @ts-ignore
        req.locals = decoded;

        next();

    } catch (error: any) {
        Logger.error(`[${MODULE}]: Error in user authentication ${error.message}`)
        return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 400, message: "Authentication Failed" }));
    }
}