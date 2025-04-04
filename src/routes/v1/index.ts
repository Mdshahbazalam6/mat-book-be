import express from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import { workspaceRoutes } from "./workflow.route";

const Router = express.Router();

Router.use('/auth', authRoutes);
Router.use('/user', userRoutes);
Router.use('/workspace', workspaceRoutes);

export { Router as routes }