import * as winston from "winston";
import "winston-daily-rotate-file";
require("dotenv").config();

const transports: any[] = process.env.AVAILABLE_LOGS.includes("debug")
  ? [
      new winston.transports.DailyRotateFile({
        filename: `${process.env.LOG_PATH}debug-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "1g",
        maxFiles: "30d",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        level: "info",
      }),
    ]
  : [];

if (process.env.LOGGER_CONSOLE_ENB === "true") {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, context, trace }) => {
            const parsedMessage = JSON.parse(message);
            return `${timestamp}-${level}: ${JSON.stringify(parsedMessage, null, 4)}\n`;
          },
        ),
      ),
    }),
  );
}

export const debugLogger = winston.createLogger({
  transports,
});
