"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const Validation = __importStar(require("../../Validation/workflow.validation"));
const Controller = __importStar(require("../../controller/workflow-controller"));
const common_validation_1 = require("../../Validation/common.validation");
const Router = express_1.default.Router();
exports.workspaceRoutes = Router;
Router
    .route('/get-all-workflows')
    .get(auth_1.Auth, Controller.getAllWorkflows);
Router
    .route('/create')
    .post(auth_1.Auth, Validation.createWorkflowValidation, Controller.createWorkflow);
Router.route('/execute')
    .post(auth_1.Auth, Validation.logExecutionValidation, Controller.executeWorkflow);
Router.route('/:id')
    .get(auth_1.Auth, common_validation_1.ObjectIdValidation, Controller.getWorkflowById)
    .put(auth_1.Auth, common_validation_1.ObjectIdValidation, Validation.updateWorkflowValidation, Controller.updateWorkflow)
    .delete(auth_1.Auth, common_validation_1.ObjectIdValidation, Controller.deleteWorkflow);
