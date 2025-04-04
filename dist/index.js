"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./common/logger");
const mongoose_1 = require("./config/mongoose");
const env_1 = require("./config/env");
const express_1 = __importDefault(require("./config/express"));
const dbConnection = (0, mongoose_1.connectToDb)();
if (dbConnection) {
    dbConnection.on('connected', () => {
        logger_1.Logger.info(`[database]: MongoDB connected`);
    });
    dbConnection.on('disconnected', (err) => {
        logger_1.Logger.error(`[database]: MongoDB got disConnected ${err.message}`);
        process.exit(-1);
    });
    dbConnection.on('error', (err) => {
        logger_1.Logger.error(`[database]: Failed to connect to MongoDB ${err.message}`);
        process.exit(-1);
    });
}
else {
    logger_1.Logger.error(`[database]: Failed to initialize database connection`);
    process.exit(-1);
}
express_1.default.listen(env_1.Config.PORT, () => {
    console.log('Server is running on port ' + env_1.Config.PORT);
});
