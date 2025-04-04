import express from "express";
import { Auth } from "../../middleware/auth";
import * as Validation from "../../Validation/workflow.validation";
import * as Controller from "../../controller/workflow-controller";
import { ObjectIdValidation } from "../../Validation/common.validation";

const Router = express.Router();

Router
    .route('/get-all-workflows')
    .get(Auth, Controller.getAllWorkflows)

Router
    .route('/create')
    .post(Auth,
        Validation.createWorkflowValidation,
        Controller.createWorkflow
    );

Router.route('/execute')
    .post(Auth,
        Validation.logExecutionValidation,
        Controller.executeWorkflow
    )

Router.route('/:id')
    .get(Auth,
        ObjectIdValidation,
        Controller.getWorkflowById
    )
    .put(Auth,
        ObjectIdValidation,
        Validation.updateWorkflowValidation,
        Controller.updateWorkflow
    )
    .delete(Auth,
        ObjectIdValidation,
        Controller.deleteWorkflow);

export { Router as workspaceRoutes }
