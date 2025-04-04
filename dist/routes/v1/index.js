"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("./auth.route");
const user_route_1 = require("./user.route");
const workflow_route_1 = require("./workflow.route");
const Router = express_1.default.Router();
exports.routes = Router;
Router.use('/auth', auth_route_1.authRoutes);
Router.use('/user', user_route_1.userRoutes);
Router.use('/workspace', workflow_route_1.workspaceRoutes);
