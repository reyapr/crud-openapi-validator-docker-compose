import { NextFunction, Request, Response } from 'express'

export interface IUserResponse {
  id: string
  name: string
  email: string
  role: string
  created_at: Date
  updated_at: Date
}

export interface IUserController {
  findAll(_: Request, res: Response, next: NextFunction): Promise<void>
  findById(req: Request, res: Response, next: NextFunction): Promise<void>
  create(req: Request, res: Response, next: NextFunction): Promise<void>
  update(req: Request, res: Response, next: NextFunction): Promise<void>
  softDelete(req: Request, res: Response, next: NextFunction): Promise<void>
}
