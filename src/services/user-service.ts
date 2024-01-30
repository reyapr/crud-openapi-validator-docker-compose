import { ERROR_CODE } from "../config/error-code";
import { IUserDTO } from "../interfaces/dto";
import { IUserEntity } from "../interfaces/entity-interfaces";
import { IUserRepository } from "../interfaces/repository-interfaces";
import { IUserService } from "../interfaces/service-interfaces";
import { StandardError } from "../utils/standard-error";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(): Promise<IUserEntity[]> {
    return await this.userRepository.findAll();
  }
  
  async findById(id: string): Promise<IUserEntity>{
    const result = await this.userRepository.findById(id);
    
    if (!result) {
      throw new StandardError({
        error_code: ERROR_CODE.USER_NOT_FOUND,
        message: 'User not found',
      });
    }
    
    return result;
  }
  
  async create(user: IUserDTO): Promise<IUserEntity> {
    try {
      console.log('[IN_PROGGESS][UserService] create a new user');
      
      const result = await this.userRepository.create(user);
      
      console.log('[SUCCESS][UserService] create a new user');
      return result;
    } catch {
      console.log('[FAILED][UserService] Failed to create a new user');
      throw new StandardError({
        error_code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Failed to create a new user',
      });
    }
  }
  
  async update(id: string, user: IUserDTO): Promise<IUserEntity> {
    try {
      console.log({id, user}, '[IN_PROGGESS][UserService] update find a user by id');
      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        throw new StandardError({
          error_code: ERROR_CODE.USER_NOT_FOUND,
          message: 'User not found',
        });
      }
      
      console.log('[IN_PROGGESS][UserService] update a user');
      const result = await this.userRepository.update(id, user);
      
      console.log('[SUCCESS][UserService] update a user');
      return result!;
    } catch (error) {
      console.log('[FAILED][UserService] Failed to update a user');
      if (error instanceof StandardError) {
        throw error;
      }
      throw new StandardError({
        error_code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Failed to update a user',
      
      });
    }
  }
  
  async softDelete(id: string): Promise<IUserEntity> {
    try {
      console.log({id}, '[IN_PROGGESS][UserService] soft delete find a user by id');
      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        throw new StandardError({
          error_code: ERROR_CODE.USER_NOT_FOUND,
          message: 'User not found',
        });
      }
      
      const softDeleteUserExistReq: IUserDTO = {
        ...userExists,
        deleted_at: new Date(),
      }
      
      console.log({ softDeleteUserExistReq }, '[IN_PROGGESS][UserService] soft delete a user');
      
      const result = await this.userRepository.update(id, softDeleteUserExistReq);
      
      console.log({ result }, '[SUCCESS][UserService] soft delete a user');
      return result!;
    } catch (error) {
      console.log('[FAILED][UserService] Failed to soft delete a user');
      if (error instanceof StandardError) {
        throw error;
      }
      throw new StandardError({
        error_code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Failed to soft delete a user',
      });
    }
  }
}