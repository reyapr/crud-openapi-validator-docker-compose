import { IUserDTO } from "./dto";
import { IUserEntity } from "./entity-interfaces";

export interface IUserRepository {
  findAll(): Promise<IUserEntity[]>;
  findById(id: string): Promise<IUserEntity | null>;
  create(user: IUserDTO): Promise<IUserEntity>;
  update(id: string, user: IUserDTO): Promise<IUserEntity | null>;
  delete(id: string): Promise<void>;
}