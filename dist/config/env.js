"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../common/logger");
const result = dotenv_1.default.config();
if (result.error) {
    logger_1.Logger.error(`Error in resolving environment variables: ${result.error}`);
}
exports.Config = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRY_TIME: process.env.TOKEN_EXPIRY_TIME,
    MONGODB: {
        USERNAME: process.env.USERNAME,
        PASSWORD: process.env.PASSWORD,
    },
};
