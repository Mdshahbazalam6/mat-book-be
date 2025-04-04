import express from "express";
import * as Controller from "../../controller/user.controller";
import { Auth } from "../../middleware/auth";
import { ICustomRequest } from "../../types";
import { ObjectIdValidationInBody } from "../../Validation/common.validation";

const Router = express.Router();

Router
    .route("/pin-workflow")
    .post(
        Auth,
        ObjectIdValidationInBody,
        Controller.pinWorkflow
    )

export { Router as userRoutes }