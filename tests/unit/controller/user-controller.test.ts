import { NextFunction, Request, Response } from "express";
import { UserController } from "../../../src/controller/user-controller";
import { IUserController } from "../../../src/interfaces/controller-interfaces";
import { IUserService } from "../../../src/interfaces/service-interfaces";

describe("UserController", () => {
  let userController: IUserController;
  const userService = {} as IUserService;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  
  beforeEach(() => {
    userController = new UserController(userService);
  })
  
  it('should success find all users', async () => {
    userService.findAll = jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'test',
        email: 'test@mail.com',
        role: 'test',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      }
    ]);
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = {} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.findAll(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        id: '1',
        name: 'test',
        email: 'test@mail.com',
        role: 'test',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    ]));
    expect(userService.findAll).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should failed find all users', async () => {
    userService.findAll = jest.fn().mockRejectedValue(new Error('test'));
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = {} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.findAll(req, res, next);
    
    expect(res.status).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(userService.findAll).toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(new Error('test'));
  });
  
  it('should success find user by id', async () => {
    userService.findById = jest.fn().mockResolvedValue({
      id: '1',
      name: 'test',
      email: 'test@mail.com',
      role: 'test',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    });
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = { params: { id: '1' }} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.findById(req, res, next);
    
    expect(userService.findById).toHaveBeenCalledWith('1')
    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      id: '1',
      name: 'test',
      email: 'test@mail.com',
      role: 'test',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    }));
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should failed find user by id', async () => {
    userService.findById = jest.fn().mockRejectedValue(new Error('test'));
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = { params: { id: '1' }} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.findById(req, res, next);
    
    expect(userService.findById).toHaveBeenCalledWith('1');
    expect(res.status).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error('test'));
  });
  
  it('should success create user', async () => {
    userService.create = jest.fn().mockResolvedValue({
      id: '1',
      name: 'test',
      email: 'test@mail.com',
      role: 'test',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    });
    
    const reqBody = { name: 'test', email: 'test@mail.com', role: 'test', password: 'test' }
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = { body:  reqBody} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.create(req, res, next);
    
    expect(userService.create).toHaveBeenCalledWith({
      name: reqBody.name,
      email: reqBody.email,
      role: reqBody.role,
      password: reqBody.password
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      id: '1',
      name: 'test',
      email: 'test@mail.com',
      role: 'test',
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
    
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should failed create user', async () => {
    userService.create = jest.fn().mockRejectedValue(new Error('test'));
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    const reqBody = { name: 'test', email: 'test@mail.com', role: 'test', password: 'test' }
    req = { body:  reqBody} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.create(req, res, next);
    
    expect(userService.create).toHaveBeenCalledWith({
      name: reqBody.name,
      email: reqBody.email,
      role: reqBody.role,
      password: reqBody.password
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error('test'));
  });
  
  it('should success update user', async () => {
    userService.update = jest.fn().mockResolvedValue(1);
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    const reqBody = { name: 'test', email: 'test@mail.com', role: 'test', password: 'test' }
    req = { params: { id: '1' }, body: reqBody} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.update(req, res, next);
    
    expect(userService.update).toHaveBeenCalledWith('1', {
      name: reqBody.name,
      email: reqBody.email,
      role: reqBody.role,
      password: reqBody.password
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      affected: 1
    }));
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should failed update user', async () => {
    userService.update = jest.fn().mockRejectedValue(new Error('test'));
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    const reqBody = { name: 'test', email: 'test@mail.com', role: 'test', password: 'test' }
    req = { params:  { id: '1'}, body: reqBody} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.update(req, res, next);
    
    expect(userService.update).toHaveBeenCalledWith('1', {
      name: reqBody.name,
      email: reqBody.email,
      role: reqBody.role,
      password: reqBody.password
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error('test'));
  });
  
  it('should success soft delete user', async () => {
    userService.softDelete = jest.fn().mockResolvedValue(1);
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = { params: { id: '2' }} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.softDelete(req, res, next);
    
    expect(userService.softDelete).toHaveBeenCalledWith('2');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      affected: 1
    }));
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should failed soft delete user', async () => {
    userService.softDelete = jest.fn().mockRejectedValue(new Error('test'));
    
    const jsonMock = jest.fn();
    const statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = { params: { id: '2' }} as unknown as Request;
    res = { status: statusMock } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
    
    await userController.softDelete(req, res, next);
    
    expect(userService.softDelete).toHaveBeenCalledWith('2');
    expect(res.status).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error('test'));
  });
});