import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Logger } from "../common/logger";
import { User as UserModel } from "../model/User.model";
import { responseFormatter } from "../utils/express";

const MODULE = "ADMIN"

export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const userExists = await UserModel.findOne({ email: req.body.email }).lean();
        if (userExists) {
            return res.status(409).json(responseFormatter({ data: null, success: false, error_code: 409, message: "Email already exists" }))
        }

        //hash the password
        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;

        let result = await new UserModel(req.body).save();
        if (!result) {
            return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 400, message: "failed to create user" }));
        }
        return res.status(200).json(responseFormatter({ data: result, success: true, message: "User created successfully" }));
    } catch (error: any) {
        Logger.error(`[${MODULE}]: Error in creating user ${error.message}`)
        return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 400, message: "failed to create user" }));
    }
}

export const signInUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 409, message: "User not found" }))
        }

        const bryptPasswd = await bcrypt.compare(req.body.password, user.password || '');
        if (!bryptPasswd) res.status(404).json(responseFormatter({ data: null, success: false, error_code: 409, message: "Invalid Credentials" }))

        //@ts-ignore
        const token = await user.getJWT();

        res.cookie("chatToken", token, {
            httpOnly: true, // (optional, but recommended for security)
            sameSite: "none",
            secure: true, // ✅ Required when using sameSite: "None"
            expires: new Date(Date.now() + 8 * 3600000),
        });

        return res.status(200).json(responseFormatter({ data: user, success: true, message: "User logged in successfully" }));

    } catch (error: any) {
        Logger.error(`[${MODULE}]: Error in creating user ${error.message}`)
        return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 400, message: "failed to create user" }));
    }
}
