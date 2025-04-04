import { Request, Response } from 'express';
import { Workflow as WorkflowModel } from '../model/workflow.model';
import { ICustomRequest } from '../types';
import { responseFormatter } from '../utils/express';
import { Logger } from '../common/logger';
import mongoose from 'mongoose';
import { User as UserModel } from '../model/User.model';

const MODULE = "WORKFLOW"
// Get all workflows
export const getAllWorkflows = async (req: Request, res: Response): Promise<any> => {
  try {
    //@ts-ignore
    const { _id } = req.locals;

    // Fetch user details to get pinned workflows
    const user = await UserModel.findById(_id).select("pinnedWorkFlow");
    if (!user) {
      return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 404, message: "User not found" }));
    }


    // Fetch pinned workflows
    const pinnedWorkflows = await WorkflowModel.find({ _id: { $in: user.pinnedWorkFlow } }).populate({
      path: 'lastUpdatedBy',
      select: 'firstName lastName email',
      model: 'User'
    }).lean();

    // Fetch normal workflows
    // createdBy: new mongoose.Types.ObjectId(String(_id)), 
    const normalWorkflows = await WorkflowModel.find({ _id: { $nin: user.pinnedWorkFlow } }).populate({
      path: 'lastUpdatedBy',
      select: 'firstName lastName email',
      model: 'User'
    }).lean();

    return res.status(200).json(responseFormatter({ data: { pinnedWorkflows, normalWorkflows }, success: true, message: "Ok" }));

  } catch (error: any) {
    Logger.error(`[${MODULE}]: Error in getting workflow ${error.message}`)
    return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error fetching workflows" }));
  }
};

// Get a workflow by ID
export const getWorkflowById = async (req: Request, res: Response): Promise<any> => {
  try {
    //@ts-ignore
    const { _id } = req.locals;

    const workflow = await WorkflowModel.findOne({ _id: req.params.id, createdBy: new mongoose.Types.ObjectId(String(_id)) });
    if (!workflow) {
      return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 404, message: "Workflow not found" }));
    }

    return res.status(200).json(responseFormatter({ data: workflow, success: true, message: "Ok" }));
  } catch (error: any) {
    Logger.error(`[${MODULE}]: Error in in getting workflow ${error.message}`)
    return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error fetching workflows" }));

  }
};

// Create a new workflow
export const createWorkflow = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, steps, status, description } = req.body;

    //@ts-ignore
    const { _id } = req.locals;

    const newWorkflow = new WorkflowModel({ name, steps, status, description, createdBy: new mongoose.Types.ObjectId(String(_id)), lastUpdatedBy: new mongoose.Types.ObjectId(String(_id)) });
    const workflow = await newWorkflow.save();

    return res.status(200).json(responseFormatter({ data: workflow, success: true, message: "Workflow created successfully" }));
  } catch (error: any) {
    Logger.error(`[${MODULE}]: Error creating workflow ${error.message}`)
    return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error creating workflow" }));
  }
};

// Update a workflow
export const updateWorkflow = async (req: Request, res: Response): Promise<any> => {
  try {
    if (req.body.execute) {
      const steps = req.body.steps || [];
      const allSuccessful = steps.every((r: any) => r.status === true);
      req.body.status = allSuccessful ? "Completed" : "Failed";
    } else {
      req.body.status = 'Active';
    }
    //@ts-ignore
    req.body.lastUpdatedBy = req?.locals?._id;

    const workflow = await WorkflowModel.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
    if (!workflow) {
      return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 404, message: "Workflow not found" }));
    }

    return res.status(200).json(responseFormatter({ data: workflow, success: true, message: "Ok" }));
  } catch (error: any) {
    Logger.error(`[${MODULE}]: Error updating workflow ${error.message}`)
    return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error updating workflow" }));
  }
};

// Delete a workflow
export const deleteWorkflow = async (req: Request, res: Response): Promise<any> => {
  try {
    const workflow = await WorkflowModel.findByIdAndDelete(req.params.id);
    if (!workflow) {
      return res.status(404).json(responseFormatter({ data: null, success: false, error_code: 404, message: "Workflow not found" }));
    }
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error: any) {
    Logger.error(`[${MODULE}]: Error deleting workflow ${error.message}`)
    return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error deleting workflow" }));
  }
};

const logExecution = async (workflowId: string, userId: string, status: 'Draft' | 'Active' | 'Completed' | 'Failed', errorMessage = null, duration = null) => {
  await WorkflowModel.findByIdAndUpdate(workflowId, {
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

export const executeWorkflow = async (req: Request, res: Response): Promise<any> => {
  try {
    const { _id, status, duration, errorMessage } = req.body;

    //@ts-ignore
    await logExecution(_id, req?.locals?._id, status, errorMessage, duration);

    return res.json(responseFormatter({ success: true, message: "Execution logged successfully", data: null }));
  } catch (error: any) {
    return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error in executing workflow" }));
  }
};



export const getExecutionHistory = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;

    // Fetch workflow with execution history
    const workflow = await WorkflowModel.findById(workflowId).populate("executionHistory.executedBy", "name email");

    if (!workflow) {
      return res.status(404).json(responseFormatter({ success: false, message: "Workflow not found", data: null }));
    }

    return res.json(responseFormatter({ success: true, message: "Execution history retrieved", data: workflow.executionHistory }));
  } catch (error: any) {
    return res.status(500).json(responseFormatter({ data: null, success: false, error_code: 500, message: "Error in getting execution workflow history" }));
  }
};