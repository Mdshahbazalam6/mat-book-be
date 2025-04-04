"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../common/logger");
const env_1 = require("./env");
const connectToDb = () => {
    try {
        const MONGODB_URI = `mongodb+srv://${env_1.Config.MONGODB.USERNAME}:${env_1.Config.MONGODB.PASSWORD}@cluster0.k4xu2.mongodb.net/metabook`;
        mongoose_1.default.connect(MONGODB_URI, {
            appName: 'chat-app',
        });
        return mongoose_1.default.connection;
    }
    catch (error) {
        logger_1.Logger.error(`Error in connecting to the database: ${error}`);
    }
};
exports.connectToDb = connectToDb;
