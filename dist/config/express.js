"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = require("../common/logger");
const index_1 = require("../routes/v1/index");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // If using cookies or authentication
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use('/api/v1', index_1.routes);
app.use(function (err, req, res, next) {
    console.log(err);
    logger_1.Logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
});
exports.default = app;
