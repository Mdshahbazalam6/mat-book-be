import dotenv from "dotenv";
import { Logger } from "../common/logger";

const result = dotenv.config();
if (result.error) {
    Logger.error(`Error in resolving environment variables: ${result.error}`)
}
console.log(result);

export const Config = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRY_TIME: process.env.TOKEN_EXPIRY_TIME,
    MONGODB: {
        USERNAME: process.env.USERNAME,
        PASSWORD: process.env.PASSWORD,
    },
}