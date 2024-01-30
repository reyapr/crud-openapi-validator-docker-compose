import { NextFunction, Request, Response } from "express";
import { StandardError } from "../utils/standard-error";

export class ErrorMiddleware {
  constructor() {}
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static handle = (err: Error | StandardError, request: Request, res: Response, next: NextFunction): Response => {
    if (err instanceof StandardError) {
      return res.status(err.error_code).json({
        message: err.message,
      });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
}