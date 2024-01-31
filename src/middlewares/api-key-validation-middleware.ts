import { Request, Response, NextFunction } from 'express'
import { API_KEY } from '../config'

export class ApiKeyValidationMiddleware {
  constructor() {}

  public static handle(req: Request, res: Response, next: NextFunction): void {
    const apiKey = req.get('api-key')

    if (apiKey !== API_KEY) {
      res.status(401).json({
        message: 'Invalid API Key'
      })
    }

    next()
  }
}
