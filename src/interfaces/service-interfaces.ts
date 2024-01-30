import { IUserDTO } from "./dto";
import { IUserEntity } from "./entity-interfaces";

export interface IUserService {
  findAll(): Promise<IUserEntity[]>;
  findById(id: number): Promise<IUserEntity>;
  create(user: IUserDTO): Promise<IUserEntity>;
  update(id: number, user: IUserDTO): Promise<IUserEntity>;
  softDelete(id: number): Promise<IUserEntity>;
}