"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutionHistory = exports.executeWorkflow = exports.deleteWorkflow = exports.updateWorkflow = exports.createWorkflow = exports.getWorkflowById = exports.getAllWorkflows = void 0;
const workflow_model_1 = require("../model/workflow.model");
const express_1 = require("../utils/express");
const logger_1 = require("../common/logger");
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = require("../model/User.model");
const MODULE = "WORKFLOW";
// Get all workflows
const getAllWorkflows = async (req, res) => {
    try {
        //@ts-ignore
        const { _id } = req.locals;
        // Fetch user details to get pinned workflows
        const user = await User_model_1.User.findById(_id).select("pinnedWorkFlow");
        if (!user) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 404, message: "User not found" }));
        }
        // Fetch pinned workflows
        const pinnedWorkflows = await workflow_model_1.Workflow.find({ _id: { $in: user.pinnedWorkFlow } }).populate({
            path: 'lastUpdatedBy',
            select: 'firstName lastName email',
            model: 'User'
        }).lean();
        // Fetch normal workflows
        // createdBy: new mongoose.Types.ObjectId(String(_id)), 
        const normalWorkflows = await workflow_model_1.Workflow.find({ _id: { $nin: user.pinnedWorkFlow } }).populate({
            path: 'lastUpdatedBy',
            select: 'firstName lastName email',
            model: 'User'
        }).lean();
        return res.status(200).json((0, express_1.responseFormatter)({ data: { pinnedWorkflows, normalWorkflows }, success: true, message: "Ok" }));
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error in getting workflow ${error.message}`);
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error fetching workflows" }));
    }
};
exports.getAllWorkflows = getAllWorkflows;
// Get a workflow by ID
const getWorkflowById = async (req, res) => {
    try {
        //@ts-ignore
        const { _id } = req.locals;
        const workflow = await workflow_model_1.Workflow.findOne({ _id: req.params.id, createdBy: new mongoose_1.default.Types.ObjectId(String(_id)) });
        if (!workflow) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 404, message: "Workflow not found" }));
        }
        return res.status(200).json((0, express_1.responseFormatter)({ data: workflow, success: true, message: "Ok" }));
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error in in getting workflow ${error.message}`);
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error fetching workflows" }));
    }
};
exports.getWorkflowById = getWorkflowById;
// Create a new workflow
const createWorkflow = async (req, res) => {
    try {
        const { name, steps, status, description } = req.body;
        //@ts-ignore
        const { _id } = req.locals;
        const newWorkflow = new workflow_model_1.Workflow({ name, steps, status, description, createdBy: new mongoose_1.default.Types.ObjectId(String(_id)), lastUpdatedBy: new mongoose_1.default.Types.ObjectId(String(_id)) });
        const workflow = await newWorkflow.save();
        return res.status(200).json((0, express_1.responseFormatter)({ data: workflow, success: true, message: "Workflow created successfully" }));
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error creating workflow ${error.message}`);
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error creating workflow" }));
    }
};
exports.createWorkflow = createWorkflow;
// Update a workflow
const updateWorkflow = async (req, res) => {
    var _a;
    try {
        if (req.body.execute) {
            const steps = req.body.steps || [];
            const allSuccessful = steps.every((r) => r.status === true);
            req.body.status = allSuccessful ? "Completed" : "Failed";
        }
        else {
            req.body.status = 'Active';
        }
        //@ts-ignore
        req.body.lastUpdatedBy = (_a = req === null || req === void 0 ? void 0 : req.locals) === null || _a === void 0 ? void 0 : _a._id;
        const workflow = await workflow_model_1.Workflow.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        if (!workflow) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 404, message: "Workflow not found" }));
        }
        return res.status(200).json((0, express_1.responseFormatter)({ data: workflow, success: true, message: "Ok" }));
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error updating workflow ${error.message}`);
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error updating workflow" }));
    }
};
exports.updateWorkflow = updateWorkflow;
// Delete a workflow
const deleteWorkflow = async (req, res) => {
    try {
        const workflow = await workflow_model_1.Workflow.findByIdAndDelete(req.params.id);
        if (!workflow) {
            return res.status(404).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 404, message: "Workflow not found" }));
        }
        res.json({ message: 'Workflow deleted successfully' });
    }
    catch (error) {
        logger_1.Logger.error(`[${MODULE}]: Error deleting workflow ${error.message}`);
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error deleting workflow" }));
    }
};
exports.deleteWorkflow = deleteWorkflow;
const logExecution = async (workflowId, userId, status, errorMessage = null, duration = null) => {
    await workflow_model_1.Workflow.findByIdAndUpdate(workflowId, {
        $push: {
            executionHistory: {
                executedBy: userId,
                status,
                errorMessage,
                duration
            }
        }
    });
};
const executeWorkflow = async (req, res) => {
    var _a;
    try {
        const { _id, status, duration, errorMessage } = req.body;
        //@ts-ignore
        await logExecution(_id, (_a = req === null || req === void 0 ? void 0 : req.locals) === null || _a === void 0 ? void 0 : _a._id, status, errorMessage, duration);
        return res.json((0, express_1.responseFormatter)({ success: true, message: "Execution logged successfully", data: null }));
    }
    catch (error) {
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error in executing workflow" }));
    }
};
exports.executeWorkflow = executeWorkflow;
const getExecutionHistory = async (req, res) => {
    try {
        const { workflowId } = req.params;
        // Fetch workflow with execution history
        const workflow = await workflow_model_1.Workflow.findById(workflowId).populate("executionHistory.executedBy", "name email");
        if (!workflow) {
            return res.status(404).json((0, express_1.responseFormatter)({ success: false, message: "Workflow not found", data: null }));
        }
        return res.json((0, express_1.responseFormatter)({ success: true, message: "Execution history retrieved", data: workflow.executionHistory }));
    }
    catch (error) {
        return res.status(500).json((0, express_1.responseFormatter)({ data: null, success: false, error_code: 500, message: "Error in getting execution workflow history" }));
    }
};
exports.getExecutionHistory = getExecutionHistory;
