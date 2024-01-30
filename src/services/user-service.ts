import { IUserDTO } from "../interfaces/dto";
import { IUserRepository } from "../interfaces/repository-interfaces";
import { IUserService } from "../interfaces/service-interfaces";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(): Promise<IUserDTO[]> {
    return await this.userRepository.findAll();
  }
  
  async findById(id: number): Promise<IUserDTO | null>{
    return await this.userRepository.findById(id);
  }
  
  async create(user: IUserDTO): Promise<IUserDTO> {
    try {
      console.log('[IN_PROGGESS][UserService] create a new user');
      
      const result = await this.userRepository.create(user);
      
      console.log('[SUCCESS][UserService] create a new user');
      return result;
    } catch {
      console.log('[FAILED][UserService] Failed to create a new user');
      throw new Error('Failed to create a new user');
    }
  }
  
  async update(id: number, user: IUserDTO): Promise<IUserDTO | null> {
    try {
      console.log({id, user}, '[IN_PROGGESS][UserService] update find a user by id');
      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        throw new Error('User not found');
      }
      
      console.log('[IN_PROGGESS][UserService] update a user');
      const result = await this.userRepository.update(id, user);
      
      console.log('[SUCCESS][UserService] update a user');
      return result;
    } catch (error) {
      console.log('[FAILED][UserService] Failed to update a user');g
      if ((error as Error).message === 'User not found') {
        throw error;
      }
      throw new Error('Failed to update a user');
    }
  }
  
  async softDelete(id: number): Promise<IUserDTO | null> {
    try {
      console.log({id}, '[IN_PROGGESS][UserService] soft delete find a user by id');
      const userExists = await this.userRepository.findById(id);
      if (!userExists) {
        throw new Error('User not found');
      }
      
      const softDeleteUserExistReq: IUserDTO = {
        ...userExists,
        deleted_at: new Date(),
      }
      
      console.log({ softDeleteUserExistReq }, '[IN_PROGGESS][UserService] soft delete a user');
      
      const result = await this.userRepository.update(id, softDeleteUserExistReq);
      
      console.log({ result }, '[SUCCESS][UserService] soft delete a user');
      return result;
    } catch (error) {
      console.log('[FAILED][UserService] Failed to soft delete a user');
      if ((error as Error).message === 'User not found') {
        throw error;
      }
      throw new Error('Failed to soft delete a user');
    }
  }
}