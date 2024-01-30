import { Request, Response } from "express";
import { StandardError } from "../utils/standard-error";

export class ErrorMiddleware {
  constructor() {}
  
  public static async handle(err: Error | StandardError, _: Request, res: Response): Promise<Response> {

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