import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Logger } from "../common/logger";
import { routes } from "../routes/v1/index";

const app: Express = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://meta-book-fe.onrender.com"], // Allow frontend origin
    credentials: true, // If using cookies or authentication
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.set('trust proxy', true)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://meta-book-fe.onrender.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie");
    next();
});

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use('/api/v1', routes);

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    Logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
});


export default app;