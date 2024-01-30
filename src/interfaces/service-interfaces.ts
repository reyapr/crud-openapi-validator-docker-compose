import { IUserDTO } from "./dto";
import { IUserEntity } from "./entity-interfaces";

export interface IUserService {
  findAll(): Promise<IUserEntity[]>;
  findById(id: string): Promise<IUserEntity>;
  create(user: IUserDTO): Promise<IUserEntity>;
  update(id: string, user: IUserDTO): Promise<IUserEntity>;
  softDelete(id: string): Promise<IUserEntity>;
}