import winston from 'winston';

// Create a logger
export const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        // winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Log to the console
        new winston.transports.Console(),
        // Log to a file in the 'logs' folder
        // new winston.transports.File({ filename: path.join(__dirname, 'logs', 'app.log') })
    ]
});