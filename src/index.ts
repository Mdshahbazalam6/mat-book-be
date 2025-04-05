import { Logger } from "./common/logger";

import { connectToDb } from './config/mongoose';
import app from "./config/express";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = connectToDb();

if (dbConnection) {
    dbConnection.on('connected', () => {
        Logger.info(`[database]: MongoDB connected`);
    });

    dbConnection.on('disconnected', (err: any) => {
        Logger.error(`[database]: MongoDB got disConnected ${err.message}`);
        process.exit(-1);
    });

    dbConnection.on('error', (err: any) => {
        Logger.error(`[database]: Failed to connect to MongoDB ${err.message}`);
        process.exit(-1);
    });
} else {
    Logger.error(`[database]: Failed to initialize database connection`);
    process.exit(-1);
}


app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});



