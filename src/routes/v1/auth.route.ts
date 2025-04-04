import express from "express";
import * as Validation from "../../Validation/auth.validation";
import * as Controller from "../../controller/auth.controller";

const Router = express.Router();

Router
    .route('/signup')
    .post(Validation.signUpValidation, Controller.createUser)


Router
    .route('/signin')
    .post(Validation.signInValidation, Controller.signInUser)

// Router.route('/get-user-info')

export { Router as authRoutes }