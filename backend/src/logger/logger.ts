import * as winston from "winston";
import { accessLogger } from "./loggers/access-logger";
import { debugLogger } from "./loggers/debug-logger";
import { errorLogger } from "./loggers/error-logger";
import { infoLogger } from "./loggers/info-logger";
require("dotenv").config();

type Tlogger = "access" | "debug" | "error" | "info";

export const logger = (type: Tlogger, options: winston.LogEntry) => {
  switch (type) {
    case "access":
      if (process.env.AVAILABLE_LOGS.includes("access"))
        accessLogger.log(options);
      break;
    case "debug":
      if (process.env.AVAILABLE_LOGS.includes("debug"))
        debugLogger.log(options);
      break;
    case "error":
      if (process.env.AVAILABLE_LOGS.includes("error"))
        errorLogger.log(options);
      break;
    case "info":
      if (process.env.AVAILABLE_LOGS.includes("info")) infoLogger.log(options);
      break;
    default:
      break;
  }
};
