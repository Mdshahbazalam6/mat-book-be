"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = __importDefault(require("winston"));
// Create a logger
exports.Logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(
    // winston.format.timestamp(),
    winston_1.default.format.json()),
    transports: [
        // Log to the console
        new winston_1.default.transports.Console(),
        // Log to a file in the 'logs' folder
        // new winston.transports.File({ filename: path.join(__dirname, 'logs', 'app.log') })
    ]
});
