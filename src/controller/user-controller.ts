import { NextFunction, Request, Response, Router } from "express";
import { IUserService } from "../interfaces/service-interfaces";
import { IUserController, IUserResponse } from "../interfaces/controller-interfaces";
import { IUserEntity } from "../interfaces/entity-interfaces";

export class UserController implements IUserController {
  private readonly router: Router;
  
  constructor (private readonly userService: IUserService) {
    this.router = Router();
    
    this.router.get('/', this.findAll.bind(this));
    this.router.get('/:id', this.findById.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.put('/:id', this.update.bind(this));
    this.router.delete('/:id', this.softDelete.bind(this));
  }
  
  getRouter(): Router {
    return this.router;
  }
  
  private static constructUserResponse(user: IUserEntity): IUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
  
  async findAll(_: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.userService.findAll();
      const userResponse: IUserResponse[] = result.map((user) => UserController.constructUserResponse(user));
    
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  }
  
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.userService.findById(id as string);
      
      const userResponse: IUserResponse = UserController.constructUserResponse(result);
      
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, role, password } = req.body;
      const result = await this.userService.create({ name, email, role, password });
      
      const userResponse: IUserResponse = UserController.constructUserResponse(result);
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  }
  
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, role, password } = req.body;
      const result = await this.userService.update(id as string, { name, email, role, password });
      
      const userResponse: IUserResponse = UserController.constructUserResponse(result);
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  }
  
  async softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.userService.softDelete(id as string);
      
      const userResponse: IUserResponse = UserController.constructUserResponse(result);
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  }
}