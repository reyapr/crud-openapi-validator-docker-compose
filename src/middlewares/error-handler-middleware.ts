/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { StandardError } from '../utils/standard-error'
import { HttpError } from 'express-openapi-validator/dist/framework/types'

export class ErrorMiddleware {
  constructor() {}

  public static handle = (
    err: Error | StandardError | HttpError,
    request: Request,
    res: Response,
    next: NextFunction
  ): Response => {
    if (err instanceof StandardError) {
      return res.status(err.error_code).json({
        message: err.message
      })
    }

    return res.status((err as HttpError).status || 500).json({
      message: err.message
    })
  }
}
