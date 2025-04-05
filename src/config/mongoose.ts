import mongoose from 'mongoose';
import { Logger } from "../common/logger";

export const connectToDb = () => {
    try {
        const MONGODB_URI = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.k4xu2.mongodb.net/metabook`;

        mongoose.connect(MONGODB_URI, {
            appName: 'chat-app',
        })

        return mongoose.connection;
    } catch (error) {
        Logger.error(`Error in connecting to the database: ${error}`);
    }
}