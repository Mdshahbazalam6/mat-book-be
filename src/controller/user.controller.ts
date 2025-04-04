import { Request, Response } from "express";
import { Logger } from "../common/logger";
import { User as UserModel } from "../model/User.model";
import { responseFormatter } from "../utils/express";
import { ICustomRequest } from "../types";
import mongoose from "mongoose";
import { Workflow as WorkflowModel } from "../model/workflow.model";

const MODULE = "USER";

export const pinWorkflow = async (req: Request, res: Response): Promise<any> => {
    try {
        //@ts-ignore
        const { _id } = req.locals;
        const workFlowExists = await WorkflowModel.findById(req.body.id).lean();
        if (!workFlowExists) {
            return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 404, message: "workflow does not exist" }));
        }

        const user = await UserModel.findById(_id)
        const alreadyPinned = user?.pinnedWorkFlow.find((ele: mongoose.Types.ObjectId) => ele.toString() === req.body.id);
        if (alreadyPinned) {
            const data = user?.pinnedWorkFlow?.filter((ele: mongoose.Types.ObjectId) => ele.toString() !== req.body.id);
            if (user) {
                // @ts-ignore
                user.pinnedWorkFlow = data;
            }
            await user?.save();
        } else {
            user?.pinnedWorkFlow.push(new mongoose.Types.ObjectId(String(req.body.id)))
        }

        await user?.save();

        return res.status(200).json(responseFormatter({ data: null, success: true, message: "Ok" }));

    } catch (error: any) {
        Logger.error(`[${MODULE}]: Error in workflow pin ${error.message}`)
        return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error in pin workflows" }));
    }
};