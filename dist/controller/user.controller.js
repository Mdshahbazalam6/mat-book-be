"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinWorkflow = void 0;
const logger_1 = require("../common/logger");
const User_model_1 = require("../model/User.model");
const express_1 = require("../utils/express");
const mongoose_1 = __importDefault(require("mongoose"));
const workflow_model_1 = require("../model/workflow.model");
const MODULE = "USER";
const pinWorkflow = async (req, res) => {
    var _a;
    try {
        //@ts-ignore
        const { _id } = req.locals;
        const workFlowExists = await workflow_model_1.Workflow.findById(req.body.id).lean();
        if (!workFlowExists) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 404, message: "workflow does not exist" }));
        }
        const user = await User_model_1.User.findById(_id);
        const alreadyPinned = user === null || user === void 0 ? void 0 : user.pinnedWorkFlow.find((ele) => ele.toString() === req.body.id);
        if (alreadyPinned) {
            const data = (_a = user === null || user === void 0 ? void 0 : user.pinnedWorkFlow) === null || _a === void 0 ? void 0 : _a.filter((ele) => ele.toString() !== req.body.id);
            if (user) {
                // @ts-ignore
                user.pinnedWorkFlow = data;
            }
            await (user === null || user === void 0 ? void 0 : user.save());
        }
        else {
            user === null || user === void 0 ? void 0 : user.pinnedWorkFlow.push(new mongoose_1.default.Types.ObjectId(String(req.body.id)));
        }
        await (user === null || user === void 0 ? void 0 : user.save());
        return res.status(200).json((0, express_1.responseFormatter)({ data: null, success: true, message: "Ok" }));
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error in workflow pin ${error.message}`);
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error in pin workflows" }));
    }
};
exports.pinWorkflow = pinWorkflow;
