import mongoose from 'mongoose';
import { Logger } from "../common/logger";
import { Config } from "./env";

export const connectToDb = () => {
    try {
        const MONGODB_URI = `mongodb+srv://${Config.MONGODB.USERNAME}:${Config.MONGODB.PASSWORD}@cluster0.k4xu2.mongodb.net/metabook`;

        mongoose.connect(MONGODB_URI, {
            appName: 'chat-app',
        })

        return mongoose.connection;
    } catch (error) {
        Logger.error(`Error in connecting to the database: ${error}`);
    }
}