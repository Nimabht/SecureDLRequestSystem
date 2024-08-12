import { Injectable, NestMiddleware, RequestMethod } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { extractTokenData, maskFields } from "../logger/helpers";
import { logger } from "../logger/logger";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = uuidv4();

    const maskedBody = maskFields(["password"], req.body);
    logger("access", {
      level: "info",
      message: JSON.stringify({
        type: "incoming_req",
        id: id,
        ip: req.ip,
        body: maskedBody,
        method: req.method,
        endpoint: req.originalUrl,
        meta: extractTokenData(req.headers.authorization) || "Invalid token",
      }),
    });

    res.on("finish", () => {
      const contentLength = res.get("content-length");

      logger("access", {
        level: "info",
        message: JSON.stringify({
          type: "outgoing_res",
          id: id,
          status: res.statusCode,
          contentLength,
        }),
      });
    });

    if (next) {
      next();
    }
  }
}
